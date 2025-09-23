import React from 'react';

const SEOContent: React.FC = () => {
  return (
    <div className="sr-only" aria-hidden="true">
      {/* Contenu SEO pour les moteurs de recherche */}
      <h1>France Pharmacies - Trouvez une pharmacie près de chez vous</h1>
      
      <section>
        <h2>Pharmacies en France par ville</h2>
        <ul>
          <li>Pharmacies à Paris - Trouvez une pharmacie ouverte à Paris, pharmacies de garde 24h/24</li>
          <li>Pharmacies à Lyon - Pharmacies ouvertes à Lyon, pharmacies de garde et horaires</li>
          <li>Pharmacies à Marseille - Trouvez une pharmacie à Marseille, pharmacies de garde</li>
          <li>Pharmacies à Bordeaux - Pharmacies ouvertes à Bordeaux, géolocalisation</li>
          <li>Pharmacies à Nice - Pharmacies à Nice, pharmacies de garde et horaires d'ouverture</li>
        </ul>
      </section>
      
      <section>
        <h2>Pharmacies de garde en France</h2>
        <p>
          Trouvez rapidement une pharmacie de garde près de chez vous. Notre service vous permet de localiser 
          les pharmacies ouvertes 24h/24 et 7j/7 dans toute la France. Recherche par géolocalisation ou par ville.
        </p>
        <ul>
          <li>Pharmacie de garde Paris - Service 24h/24 dans la capitale</li>
          <li>Pharmacie de garde Lyon - Pharmacies ouvertes la nuit à Lyon</li>
          <li>Pharmacie de garde Marseille - Service d'urgence pharmaceutique</li>
          <li>Pharmacie de garde Bordeaux - Pharmacies ouvertes le dimanche</li>
          <li>Pharmacie de garde Nice - Service de garde sur la Côte d'Azur</li>
        </ul>
      </section>
      
      <section>
        <h2>Services disponibles</h2>
        <ul>
          <li>Géolocalisation automatique pour trouver les pharmacies les plus proches</li>
          <li>Recherche par adresse dans toute la France</li>
          <li>Filtres avancés : rayon de recherche, pharmacies de garde, horaires</li>
          <li>Carte interactive avec itinéraires</li>
          <li>Informations complètes : adresse, téléphone, horaires d'ouverture</li>
          <li>Tendances des médicaments remboursés par l'Assurance Maladie</li>
          <li>Actualités pharmaceutiques et santé</li>
        </ul>
      </section>
      
      <section>
        <h2>Recherche de médicaments et tendances</h2>
        <p>
          Découvrez les tendances des médicaments les plus prescrits en France. 
          Données officielles de la CNAM (Caisse Nationale d'Assurance Maladie) 
          avec analyse des ventes et remboursements.
        </p>
      </section>
      
      <section>
        <h2>Actualités pharmaceutiques</h2>
        <p>
          Restez informé des dernières actualités du secteur pharmaceutique français : 
          nouveaux médicaments, réglementations, pénuries, innovations santé.
        </p>
      </section>
      
      <section>
        <h2>Application mobile et tablette</h2>
        <p>
          France Pharmacies est optimisé pour tous les appareils : smartphones iOS et Android, 
          tablettes iPad et Android. Interface responsive et fonctionnalités tactiles optimisées.
        </p>
      </section>
    </div>
  );
};

export default SEOContent;