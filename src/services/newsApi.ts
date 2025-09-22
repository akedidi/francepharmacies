import { NewsResponse } from '../types/trends';

// Données simulées pour éviter les erreurs API
const mockNewsData: NewsResponse = {
  status: 'ok',
  totalResults: 20,
  articles: [
    {
      source: { name: 'Pharmaceutiques Hebdo' },
      title: 'Ozempic et Wegovy : nouvelle étude sur les effets cardiovasculaires',
      description: 'Une étude internationale révèle de nouveaux bénéfices cardiovasculaires des agonistes du GLP-1, renforçant leur position sur le marché français.',
      url: 'https://www.pharmaceutiques-hebdo.fr/ozempic-wegovy-cardiovasculaire',
      urlToImage: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // Il y a 6 heures
    },
    {
      source: { name: 'Le Quotidien du Médecin' },
      title: 'Pénurie de Doliprane : les pharmaciens s\'adaptent',
      description: 'Face aux tensions d\'approvisionnement sur le paracétamol, les pharmaciens mettent en place des stratégies alternatives pour assurer la continuité des soins.',
      url: 'https://www.lequotidiendumedecin.fr/doliprane-penurie-2025',
      urlToImage: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=400',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // Il y a 12 heures
    },
    {
      source: { name: 'APM News' },
      title: 'Mounjaro : autorisation élargie pour l\'obésité en France',
      description: 'L\'ANSM vient d\'approuver l\'extension d\'indication du tirzepatide (Mounjaro) pour le traitement de l\'obésité, ouvrant de nouvelles perspectives thérapeutiques.',
      url: 'https://www.apmnews.com/mounjaro-obesite-france-2025',
      urlToImage: 'https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=400',
      publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString() // Il y a 18 heures
    },
    {
      source: { name: 'Santé Log' },
      title: 'Intelligence artificielle en pharmacie : premiers déploiements',
      description: 'Les premières officines françaises testent des solutions d\'IA pour optimiser la gestion des stocks et améliorer le conseil pharmaceutique.',
      url: 'https://www.santelog.com/ia-pharmacie-deploiement-2025',
      urlToImage: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=400',
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // Hier
    },
    {
      source: { name: 'Pharma Letter France' },
      title: 'Biosimilaires : adoption record en 2024',
      description: 'Les médicaments biosimilaires atteignent un taux d\'adoption de 85% en France, générant des économies importantes pour l\'Assurance Maladie.',
      url: 'https://www.pharmaletter.fr/biosimilaires-adoption-2024',
      urlToImage: 'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=400',
      publishedAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString() // Il y a 1,5 jour
    },
    {
      source: { name: 'Le Figaro Santé' },
      title: 'Nouvelle réglementation européenne sur les médicaments génériques',
      description: 'L\'Agence européenne des médicaments annonce de nouvelles directives pour améliorer l\'accès aux médicaments génériques dans toute l\'Union européenne.',
      url: 'https://www.lefigaro.fr/sante/medicaments-generiques',
      urlToImage: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400',
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      source: { name: 'Le Monde Sciences' },
      title: 'Pénurie de médicaments : les pharmaciens s\'organisent',
      description: 'Face aux ruptures d\'approvisionnement croissantes, les pharmaciens développent de nouvelles stratégies pour assurer la continuité des soins.',
      url: 'https://www.lemonde.fr/sciences/pharmacie-penurie',
      urlToImage: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=400',
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      source: { name: 'France Info Santé' },
      title: 'Innovation pharmaceutique : un nouveau traitement contre l\'Alzheimer',
      description: 'Un laboratoire français annonce des résultats prometteurs pour un nouveau médicament destiné à ralentir la progression de la maladie d\'Alzheimer.',
      url: 'https://www.francetvinfo.fr/sante/alzheimer-traitement',
      urlToImage: 'https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=400',
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      source: { name: 'Libération Santé' },
      title: 'Téléconsultation et prescription électronique en hausse',
      description: 'L\'usage de la téléconsultation et des ordonnances électroniques continue de progresser, transformant la relation patient-pharmacien.',
      url: 'https://www.liberation.fr/sante/teleconsultation',
      urlToImage: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=400',
      publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      source: { name: 'Ouest-France Santé' },
      title: 'Vaccination : nouvelle campagne de sensibilisation en pharmacie',
      description: 'Les pharmaciens élargissent leur rôle dans la vaccination avec une nouvelle campagne nationale de sensibilisation aux vaccins saisonniers.',
      url: 'https://www.ouest-france.fr/sante/vaccination-pharmacie',
      urlToImage: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=400',
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      source: { name: 'BFM Business' },
      title: 'Industrie pharmaceutique : fusion entre deux géants européens',
      description: 'Une opération de fusion majeure pourrait redessiner le paysage pharmaceutique européen avec des implications importantes pour les patients.',
      url: 'https://www.bfmtv.com/economie/fusion-pharma',
      urlToImage: 'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=400',
      publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      source: { name: 'Les Échos' },
      title: 'Prix des médicaments : nouvelles négociations avec l\'Assurance Maladie',
      description: 'Le Comité économique des produits de santé entame de nouvelles négociations pour maîtriser l\'évolution des prix des médicaments innovants.',
      url: 'https://www.lesechos.fr/industrie-services/pharmacie-sante/prix-medicaments',
      urlToImage: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400',
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      source: { name: 'Pharmaceutiques Magazine' },
      title: 'Intelligence artificielle : révolution dans la découverte de médicaments',
      description: 'Les laboratoires pharmaceutiques investissent massivement dans l\'IA pour accélérer le développement de nouveaux traitements.',
      url: 'https://www.pharmaceutiques.com/ia-medicaments',
      urlToImage: 'https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=400',
      publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      source: { name: 'Santé Magazine' },
      title: 'Médicaments biosimilaires : adoption croissante en France',
      description: 'L\'usage des médicaments biosimilaires progresse significativement, permettant des économies importantes pour l\'Assurance Maladie.',
      url: 'https://www.santemagazine.fr/biosimilaires',
      urlToImage: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=400',
      publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      source: { name: 'Quotidien du Pharmacien' },
      title: 'Ordonnance électronique : déploiement national accéléré',
      description: 'Le gouvernement annonce l\'accélération du déploiement de l\'ordonnance électronique dans toutes les pharmacies françaises.',
      url: 'https://www.lequotidiendupharmacien.fr/ordonnance-electronique',
      urlToImage: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=400',
      publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      source: { name: 'Pharma Letter' },
      title: 'Recherche clinique : la France attire les essais internationaux',
      description: 'La France renforce sa position dans la recherche clinique internationale grâce à ses nouvelles réglementations attractives.',
      url: 'https://www.pharmaletter.fr/recherche-clinique',
      urlToImage: 'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=400',
      publishedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      source: { name: 'Vidal News' },
      title: 'Antibiorésistance : nouvelles stratégies de lutte',
      description: 'Les autorités sanitaires dévoilent un plan national renforcé pour lutter contre l\'antibiorésistance et préserver l\'efficacité des antibiotiques.',
      url: 'https://www.vidal.fr/antibioresistance',
      urlToImage: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400',
      publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      source: { name: 'Prescrire' },
      title: 'Évaluation des médicaments : renforcement de la transparence',
      description: 'La Haute Autorité de Santé annonce de nouvelles mesures pour améliorer la transparence dans l\'évaluation des médicaments.',
      url: 'https://www.prescrire.org/evaluation-transparence',
      urlToImage: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=400',
      publishedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      source: { name: 'Pharmacie Centrale' },
      title: 'Logistique pharmaceutique : innovations technologiques',
      description: 'Les grossistes-répartiteurs investissent dans de nouvelles technologies pour optimiser la distribution des médicaments.',
      url: 'https://www.pharmaciecentrale.fr/logistique-innovation',
      urlToImage: 'https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=400',
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      source: { name: 'Santé Publique France' },
      title: 'Surveillance des effets indésirables : système renforcé',
      description: 'L\'ANSM déploie un nouveau système de surveillance des effets indésirables des médicaments basé sur l\'intelligence artificielle.',
      url: 'https://www.santepubliquefrance.fr/surveillance-medicaments',
      urlToImage: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=400',
      publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
};

const NEWSAPI_KEY = 'c22340f50d054e62ad7aabea4e566637';
const NEWSAPI_BASE_URL = 'https://newsapi.org/v2';

export class NewsApiService {
  static async getPharmacyNews(): Promise<NewsResponse> {
    // Utiliser les données simulées pour éviter les erreurs API
    console.log('Utilisation des données simulées pour les actualités pharmaceutiques');
    
    // Trier les articles par date (plus récent en premier)
    const sortedArticles = [...mockNewsData.articles].sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    const sortedData = {
      ...mockNewsData,
      articles: sortedArticles
    };
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(sortedData), 1000); // Simule un délai réseau
    });

    /* Code original commenté pour éviter l'erreur 426
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

    try {
      const response = await fetch(`${NEWSAPI_BASE_URL}/everything?${params}`);
      
      if (!response.ok) {
        throw new Error(`NewsAPI error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des actualités:', error);
      throw error;
    }
    */
  }

  static async searchMedicamentNews(medicamentName: string): Promise<NewsResponse> {
    // Filtrer les données simulées par nom de médicament
    const filteredArticles = mockNewsData.articles.filter(article =>
      article.title.toLowerCase().includes(medicamentName.toLowerCase()) ||
      article.description.toLowerCase().includes(medicamentName.toLowerCase())
    );

    return {
      ...mockNewsData,
      totalResults: filteredArticles.length,
      articles: filteredArticles.slice(0, 5)
    };

    /* Code original commenté
    const params = new URLSearchParams({
      q: medicamentName,
      language: 'fr',
      from: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      sortBy: 'publishedAt',
      pageSize: '5',
      apiKey: NEWSAPI_KEY
    });

    try {
      const response = await fetch(`${NEWSAPI_BASE_URL}/everything?${params}`);
      
      if (!response.ok) {
        throw new Error(`NewsAPI error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la recherche d\'actualités médicament:', error);
      throw error;
    }
    */
  }
}