import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { parse as parseCsv } from 'csv-parse/sync';
import pLimit from 'p-limit';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = Number(process.env.PORT || 8080);

// ————— CONFIG —————
const DATASET_MEDICAM = 'https://www.data.gouv.fr/api/1/datasets/medicaments-rembourses-par-lassurance-maladie/';
const API_MEDICAMENTS = (cip13: string) => `https://api-medicaments.fr/v1/medicaments/${cip13}`;
const NEWSAPI_KEY = process.env.NEWSAPI_KEY || 'c22340f50d054e62ad7aabea4e566637';
const CACHE_DIR = path.join(__dirname, '../cache');

app.use(cors());
app.use(express.json());

// ——— types ———
type MedicAmRow = {
  CIP13?: string;
  cip13?: string;
  NB_BOITES?: string;
  nb_boites?: string;
  boites?: string;
  MONTANT_REMBOURSE?: string;
  montant?: string;
  ATC5?: string;
  ATC?: string;
  [k: string]: unknown;
};

type ResourceMeta = {
  url: string;
  last_modified?: string;
  published?: string;
  title?: string;
  name?: string;
  format?: string;
};

type DataGouvDataset = {
  resources: ResourceMeta[];
};

type TrendsCache = {
  date: string;
  data: {
    source: string;
    latest_file: string;
    previous_file: string;
    generated_at: string;
    limit: number;
    items: Array<{
      cip13: string;
      label: string;
      boites: number;
      euros: number;
      delta_volume_pct: number;
      delta_valeur_pct: number;
      score_tendance: number;
      bonus_actu: number;
    }>;
  };
};

type NewsCache = {
  date: string;
  data: {
    status: string;
    totalResults: number;
    articles: Array<{
      source: { name: string };
      title: string;
      description: string;
      url: string;
      urlToImage: string;
      publishedAt: string;
    }>;
  };
};

// ——— utils ———
function toNumber(fr: unknown): number {
  if (fr == null) return 0;
  const s = String(fr).replace(/\s+/g, '').replace(',', '.');
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

async function ensureCacheDir(): Promise<void> {
  try {
    await fs.access(CACHE_DIR);
  } catch {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  }
}

async function getTodayString(): Promise<string> {
  return new Date().toISOString().split('T')[0];
}

async function readCacheFile<T>(filename: string): Promise<T | null> {
  try {
    const filePath = path.join(CACHE_DIR, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

async function writeCacheFile<T>(filename: string, data: T): Promise<void> {
  await ensureCacheDir();
  const filePath = path.join(CACHE_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function getLatestTwoMedicAMResources(): Promise<{
  latest: { url: string; lastmod: Date; title: string };
  previous: { url: string; lastmod: Date; title: string };
}> {
  const res = await fetch(DATASET_MEDICAM);
  if (!res.ok) throw new Error(`data.gouv datasets error ${res.status}`);
  const meta = (await res.json()) as DataGouvDataset;

  const csvs = (meta.resources || [])
    .filter(
      (r) =>
        (r.format || '').toLowerCase() === 'csv' &&
        /medic/i.test((r.title || r.name || ''))
    )
    .map((r) => ({
      url: r.url,
      lastmod: new Date(r.last_modified || r.published || 0),
      title: (r.title || r.name || '') as string
    }))
    .sort((a, b) => b.lastmod.getTime() - a.lastmod.getTime());

  if (csvs.length < 2) throw new Error('Pas assez de fichiers Medic\'AM disponibles.');
  return { latest: csvs[0], previous: csvs[1] };
}

async function fetchCsv(url: string): Promise<MedicAmRow[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CSV download failed ${res.status}`);
  const text = await res.text();
  const records = parseCsv(text, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ';',
    bom: true
  }) as MedicAmRow[];
  return records;
}

function indexMedicAM(rows: MedicAmRow[]): Map<string, { boites: number; euros: number; atc?: string }> {
  const out = new Map<string, { boites: number; euros: number; atc?: string }>();
  for (const r of rows) {
    const cip = (r.CIP13 || r.cip13 || '').toString().trim();
    if (!cip) continue;
    const nb = toNumber(r.NB_BOITES ?? r.nb_boites ?? r.boites ?? '0');
    const eur = toNumber(r.MONTANT_REMBOURSE ?? r.montant ?? '0');
    const atc = (r.ATC5 || r.ATC || '')?.toString()?.trim() || undefined;

    const prev = out.get(cip) || { boites: 0, euros: 0, atc };
    out.set(cip, {
      boites: prev.boites + nb,
      euros: prev.euros + eur,
      atc: atc || prev.atc
    });
  }
  return out;
}

async function fetchLabel(cip13: string): Promise<string> {
  try {
    const r = await (await fetch(API_MEDICAMENTS(cip13))).json() as any;
    const denom: string = r?.denomination || r?.nom || '';
    const dosage: string = r?.dosage || r?.presentation || '';
    return denom || dosage ? `${denom}${dosage ? ' ' + dosage : ''}` : `CIP ${cip13}`;
  } catch {
    return `CIP ${cip13}`;
  }
}

async function newsBuzzBonus(label: string): Promise<number> {
  if (!NEWSAPI_KEY) return 0;
  const q = encodeURIComponent(label);
  const from = new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString().slice(0, 10);
  const url = `https://newsapi.org/v2/everything?q=${q}&language=fr&from=${from}&sortBy=publishedAt&pageSize=5&apiKey=${NEWSAPI_KEY}`;
  try {
    const j = await (await fetch(url)).json() as any;
    const count = Array.isArray(j.articles) ? j.articles.length : 0;
    return Math.min(0.5, count * 0.05); // bonus limité (max 0.5)
  } catch {
    return 0;
  }
}

// ——— endpoints ———
app.get('/api/trends/meds', async (req: Request, res: Response) => {
  try {
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 20));
    const today = await getTodayString();
    const cacheFilename = `trends-${today}.json`;

    // Vérifier le cache
    const cachedData = await readCacheFile<TrendsCache>(cacheFilename);
    if (cachedData && cachedData.date === today && cachedData.data.limit >= limit) {
      return res.json({ ...cachedData.data, note: 'from cache' });
    }

    // Générer les données
    const { latest, previous } = await getLatestTwoMedicAMResources();
    const [rowsLatest, rowsPrev] = await Promise.all([fetchCsv(latest.url), fetchCsv(previous.url)]);

    const L = indexMedicAM(rowsLatest);
    const P = indexMedicAM(rowsPrev);

    type Entry = {
      cip: string;
      boites: number;
      euros: number;
      dBoites: number;
      dEuros: number;
      baseScore: number;
    };

    let entries: Entry[] = [];
    for (const [cip, cur] of L.entries()) {
      const prev = P.get(cip) || { boites: 0, euros: 0 };
      const dBoites = prev.boites > 0 ? (cur.boites - prev.boites) / prev.boites : (cur.boites > 0 ? 1 : 0);
      const dEuros  = prev.euros  > 0 ? (cur.euros  - prev.euros)  / prev.euros  : (cur.euros  > 0 ? 1 : 0);

      const sizeFactor = Math.log10(cur.boites + 10);
      const baseScore = (0.7 * dBoites + 0.3 * dEuros) * sizeFactor;

      entries.push({ cip, boites: cur.boites, euros: cur.euros, dBoites, dEuros, baseScore });
    }

    entries = entries
      .filter(e => e.boites >= 100)
      .sort((a,b) => b.baseScore - a.baseScore)
      .slice(0, limit * 2);

    const limiter = pLimit(5);
    const enriched = await Promise.all(entries.map(e => limiter(async () => {
      const label = await fetchLabel(e.cip);
      const bonus = await newsBuzzBonus(label);
      const score = e.baseScore + bonus;
      return { ...e, label, score, bonusActu: bonus };
    })));

    const top = enriched
      .sort((a,b) => b.score - a.score)
      .slice(0, limit)
      .map(e => ({
        cip13: e.cip,
        label: e.label,
        boites: Math.round(e.boites),
        euros: Math.round(e.euros),
        delta_volume_pct: Number((e.dBoites * 100).toFixed(1)),
        delta_valeur_pct: Number((e.dEuros  * 100).toFixed(1)),
        score_tendance: Number(e.score.toFixed(3)),
        bonus_actu: Number(e.bonusActu.toFixed(3))
      }));

    const payload = {
      source: "Medic'AM (CNAM), dernier mois vs mois précédent (ville remboursée) + bonus actu NewsAPI (14j, FR)",
      latest_file: latest.title,
      previous_file: previous.title,
      generated_at: new Date().toISOString(),
      limit,
      items: top
    };

    // Sauvegarder en cache
    await writeCacheFile(cacheFilename, { date: today, data: payload });

    res.json(payload);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err?.message || 'Erreur serveur' });
  }
});

app.get('/api/news/pharma', async (req: Request, res: Response) => {
  try {
    const today = await getTodayString();
    const cacheFilename = `news-${today}.json`;

    // Vérifier le cache
    const cachedData = await readCacheFile<NewsCache>(cacheFilename);
    if (cachedData && cachedData.date === today) {
      return res.json({ ...cachedData.data, note: 'from cache' });
    }

    // Appel à NewsAPI
    const query = 'pharmacie OR médicament OR santé OR "industrie pharmaceutique"';
    const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const params = new URLSearchParams({
      q: query,
      language: 'fr',
      from: from,
      sortBy: 'publishedAt',
      pageSize: '20',
      apiKey: NEWSAPI_KEY
    });

    const response = await fetch(`https://newsapi.org/v2/everything?${params}`);
    
    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }

    const data = await response.json() as any;
    
    // Filtrer les articles valides
    const validArticles = data.articles.filter((article: any) => 
      article.title && 
      article.description && 
      article.url &&
      !article.title.includes('[Removed]')
    );

    const payload = {
      status: 'ok',
      totalResults: validArticles.length,
      articles: validArticles.slice(0, 15).map((article: any) => ({
        source: { name: article.source.name },
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt
      }))
    };

    // Sauvegarder en cache
    await writeCacheFile(cacheFilename, { date: today, data: payload });

    res.json(payload);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err?.message || 'Erreur serveur' });
  }
});

app.listen(PORT, () => {
  console.log(`API TS listening on http://localhost:${PORT}`);
});