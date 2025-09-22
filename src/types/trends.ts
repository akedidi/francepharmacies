export interface MedicamentTrend {
  cip13: string;
  label: string;
  boites: number;
  euros: number;
  delta_volume_pct: number;
  delta_valeur_pct: number;
  score_tendance: number;
  bonus_actu: number;
}

export interface TrendsResponse {
  source: string;
  latest_file: string;
  previous_file: string;
  generated_at: string;
  limit: number;
  items: MedicamentTrend[];
  note?: string;
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}