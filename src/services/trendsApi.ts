import { TrendsResponse, MedicamentTrend } from '../types/trends';

// Simulation d'un service de tendances (en attendant le serveur backend)
export class TrendsApiService {
  static async getMedicamentTrends(limit: number = 20): Promise<TrendsResponse> {
    // Données simulées étendues avec 25 médicaments incluant des "buzz actu"
    
    const mockTrends: MedicamentTrend[] = [
      // Médicaments avec buzz actualité élevé
      {
        cip13: '3400939876543',
        label: 'OZEMPIC 0,25 mg/0,5 mg, solution injectable',
        boites: 8950,
        euros: 45670,
        delta_volume_pct: 156.8,
        delta_valeur_pct: 142.3,
        score_tendance: 9.8,
        bonus_actu: 0.85
      },
      {
        cip13: '3400938765432',
        label: 'WEGOVY 0,25 mg, solution injectable',
        boites: 6780,
        euros: 38920,
        delta_volume_pct: 189.4,
        delta_valeur_pct: 176.2,
        score_tendance: 9.6,
        bonus_actu: 0.72
      },
      {
        cip13: '3400937654321',
        label: 'PAXLOVID 150 mg/100 mg, comprimé pelliculé',
        boites: 0,
        euros: 0,
        delta_volume_pct: 0,
        delta_valeur_pct: 0,
        score_tendance: 9.4,
        bonus_actu: 0.65
      },
      {
        cip13: '3400950123456',
        label: 'MOUNJARO 2,5 mg, solution injectable',
        boites: 0,
        euros: 0,
        delta_volume_pct: 0,
        delta_valeur_pct: 0,
        score_tendance: 9.2,
        bonus_actu: 0.58
      },
      {
        cip13: '3400951234567',
        label: 'ZEPBOUND 2,5 mg, solution injectable',
        boites: 0,
        euros: 0,
        delta_volume_pct: 0,
        delta_valeur_pct: 0,
        score_tendance: 9.0,
        bonus_actu: 0.45
      },
      {
        cip13: '3400936404465',
        label: 'DOLIPRANE 1000 mg, comprimé',
        boites: 15420,
        euros: 23150,
        delta_volume_pct: 45.2,
        delta_valeur_pct: 38.7,
        score_tendance: 8.8,
        bonus_actu: 0.25
      },
      {
        cip13: '3400930225646',
        label: 'EFFERALGAN 1000 mg, comprimé effervescent',
        boites: 12890,
        euros: 19340,
        delta_volume_pct: 32.1,
        delta_valeur_pct: 29.8,
        score_tendance: 7.434,
        bonus_actu: 0.18
      },
      {
        cip13: '3400937265461',
        label: 'SPASFON 80 mg, comprimé enrobé',
        boites: 9876,
        euros: 16780,
        delta_volume_pct: 28.9,
        delta_valeur_pct: 31.2,
        score_tendance: 6.789,
        bonus_actu: 0.12
      },
      {
        cip13: '3400934009563',
        label: 'SMECTA 3 g, poudre pour suspension buvable',
        boites: 8765,
        euros: 14230,
        delta_volume_pct: 25.4,
        delta_valeur_pct: 22.1,
        score_tendance: 6.123,
        bonus_actu: 0.05
      },
      {
        cip13: '3400935556462',
        label: 'GAVISCON 500 mg/267 mg, comprimé à croquer',
        boites: 7654,
        euros: 12890,
        delta_volume_pct: 22.8,
        delta_valeur_pct: 24.5,
        score_tendance: 5.876,
        bonus_actu: 0.03
      },
      {
        cip13: '3400934567890',
        label: 'ADVIL 400 mg, comprimé pelliculé',
        boites: 6543,
        euros: 11450,
        delta_volume_pct: 19.7,
        delta_valeur_pct: 18.3,
        score_tendance: 5.234,
        bonus_actu: 0.07
      },
      {
        cip13: '3400935678901',
        label: 'VOLTARENE 75 mg, comprimé gastro-résistant',
        boites: 5432,
        euros: 9876,
        delta_volume_pct: 16.8,
        delta_valeur_pct: 15.9,
        score_tendance: 4.987,
        bonus_actu: 0.04
      },
      {
        cip13: '3400936789012',
        label: 'LEXOMIL 6 mg, comprimé sécable',
        boites: 4321,
        euros: 8765,
        delta_volume_pct: 14.2,
        delta_valeur_pct: 13.7,
        score_tendance: 4.654,
        bonus_actu: 0.02
      },
      {
        cip13: '3400937890123',
        label: 'XANAX 0,25 mg, comprimé sécable',
        boites: 3987,
        euros: 7654,
        delta_volume_pct: 12.5,
        delta_valeur_pct: 11.8,
        score_tendance: 4.321,
        bonus_actu: 0.06
      },
      {
        cip13: '3400938901234',
        label: 'MAALOX 400 mg/400 mg, comprimé à croquer',
        boites: 3456,
        euros: 6543,
        delta_volume_pct: 10.9,
        delta_valeur_pct: 9.7,
        score_tendance: 3.987,
        bonus_actu: 0.01
      },
      {
        cip13: '3400939012345',
        label: 'RHINADVIL 200 mg/30 mg, comprimé enrobé',
        boites: 2987,
        euros: 5432,
        delta_volume_pct: 8.6,
        delta_valeur_pct: 7.9,
        score_tendance: 3.654,
        bonus_actu: 0.03
      },
      {
        cip13: '3400940123456',
        label: 'HUMEX RHUME 500 mg/25 mg, comprimé',
        boites: 2654,
        euros: 4321,
        delta_volume_pct: 6.8,
        delta_valeur_pct: 6.2,
        score_tendance: 3.321,
        bonus_actu: 0.05
      },
      {
        cip13: '3400941234567',
        label: 'TOPLEXIL 0,33 mg/ml, sirop',
        boites: 2321,
        euros: 3987,
        delta_volume_pct: 5.4,
        delta_valeur_pct: 4.8,
        score_tendance: 2.987,
        bonus_actu: 0.02
      },
      {
        cip13: '3400942345678',
        label: 'FERVEX ADULTES, granulé pour solution buvable',
        boites: 1987,
        euros: 3456,
        delta_volume_pct: 4.2,
        delta_valeur_pct: 3.9,
        score_tendance: 2.654,
        bonus_actu: 0.04
      },
      {
        cip13: '3400943456789',
        label: 'ACTIFED RHUME JOUR ET NUIT, comprimé',
        boites: 1654,
        euros: 2987,
        delta_volume_pct: 3.1,
        delta_valeur_pct: 2.7,
        score_tendance: 2.321,
        bonus_actu: 0.01
      },
      {
        cip13: '3400944567890',
        label: 'NUROFEN 400 mg, comprimé pelliculé',
        boites: 1432,
        euros: 2654,
        delta_volume_pct: 2.8,
        delta_valeur_pct: 2.3,
        score_tendance: 1.987,
        bonus_actu: 0.03
      },
      {
        cip13: '3400945678901',
        label: 'STREPSILS MIEL CITRON, pastille',
        boites: 1234,
        euros: 2321,
        delta_volume_pct: 1.9,
        delta_valeur_pct: 1.6,
        score_tendance: 1.654,
        bonus_actu: 0.02
      },
      {
        cip13: '3400946789012',
        label: 'LYSOPAÏNE MAUX DE GORGE, comprimé à sucer',
        boites: 1098,
        euros: 1987,
        delta_volume_pct: 1.2,
        delta_valeur_pct: 0.9,
        score_tendance: 1.321,
        bonus_actu: 0.01
      },
      {
        cip13: '3400947890123',
        label: 'HEXASPRAY 2,5 mg/ml, solution pour pulvérisation',
        boites: 987,
        euros: 1654,
        delta_volume_pct: 0.8,
        delta_valeur_pct: 0.5,
        score_tendance: 0.987,
        bonus_actu: 0.02
      }
    ];

    // Simulation d'un délai réseau plus court
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      source: "Medic'AM (CNAM), dernier mois vs mois précédent (ville remboursée) + bonus actu NewsAPI (14j, FR)",
      latest_file: "medicaments_2024_12.csv",
      previous_file: "medicaments_2024_11.csv",
      generated_at: new Date().toISOString(),
      limit,
      items: mockTrends.slice(0, limit)
    };
  }
}