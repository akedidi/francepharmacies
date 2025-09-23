# France Pharmacies 🏥

Une application web moderne pour trouver rapidement des pharmacies près de chez vous en France.

## 🌟 Fonctionnalités

- **Recherche géolocalisée** : Trouvez automatiquement les pharmacies autour de votre position
- **Recherche par adresse** : Saisissez n'importe quelle adresse française
- **Filtres avancés** : Rayon de recherche, pharmacies de garde, horaires d'ouverture
- **Vue carte interactive** : Visualisez les pharmacies sur une carte Leaflet
- **Vue liste détaillée** : Informations complètes avec contact et itinéraires
- **Tendances médicaments** : Analyse des ventes de médicaments remboursés
- **Actualités pharmaceutiques** : Dernières nouvelles du secteur
- **Design responsive** : Interface optimisée mobile et desktop
- **Gestion des cookies RGPD** : Respect de la vie privée

## 🚀 Technologies utilisées

### Frontend
- **React 18** avec TypeScript
- **Tailwind CSS** pour le design
- **Leaflet** pour les cartes interactives
- **Lucide React** pour les icônes
- **Vite** comme bundler
- **Capacitor** pour les apps natives iOS/Android

### APIs et données
- **Overpass API** : Données OpenStreetMap des pharmacies
- **Nominatim** : Géocodage et recherche d'adresses
- **Geopf** : Service de géocodage français
- **NewsAPI** : Actualités pharmaceutiques
- **Medic'AM (CNAM)** : Données de remboursement des médicaments

### Backend (optionnel)
- **Node.js** avec Express
- **TypeScript**
- Cache fichier pour optimiser les performances

## 📦 Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- Pour les apps natives : Xcode (iOS) et Android Studio (Android)

### Installation locale

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/france-pharmacies.git
cd france-pharmacies
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer le serveur de développement**
```bash
npm run dev
```

4. **Ouvrir dans le navigateur**
```
http://localhost:5173
```

### Développement natif iOS/Android

1. **Préparer l'environnement**
```bash
# iOS (macOS uniquement)
sudo gem install cocoapods

# Android
# Installer Android Studio et configurer les SDK
```

2. **Ajouter les plateformes natives**
```bash
npm run cap:add:ios
npm run cap:add:android
```

3. **Build et synchronisation**
```bash
npm run build:native
```

4. **Ouvrir dans les IDE natifs**
```bash
# iOS (Xcode)
npm run cap:open:ios

# Android (Android Studio)
npm run cap:open:android
```

5. **Lancer sur simulateur/émulateur**
```bash
npm run cap:run:ios
npm run cap:run:android
```

### Serveur backend (optionnel)

Pour les fonctionnalités avancées (tendances, actualités) :

```bash
cd server
npm install
npm run dev
```

Le serveur backend sera disponible sur `http://localhost:8080`

## 🏗️ Structure du projet

```
france-pharmacies/
├── src/
│   ├── components/          # Composants React
│   │   ├── SearchBar.tsx
│   │   ├── MapView.tsx
│   │   ├── PharmacyList.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── TrendsTab.tsx
│   │   ├── NewsTab.tsx
│   │   └── ...
│   ├── services/           # Services API
│   │   ├── overpassApi.ts
│   │   ├── nominatimApi.ts
│   │   ├── trendsApi.ts
│   │   └── newsApi.ts
│   ├── hooks/              # Hooks personnalisés
│   │   ├── useGeolocation.ts
│   │   └── useCookieConsent.ts
│   ├── types/              # Types TypeScript
│   │   ├── pharmacy.ts
│   │   └── trends.ts
│   └── ...
├── server/                 # Backend Node.js (optionnel)
│   ├── src/
│   │   └── index.ts
│   └── package.json
└── ...
```

## 🌐 APIs utilisées

### Données des pharmacies
- **Overpass API** : Extraction des pharmacies depuis OpenStreetMap
- **Nominatim** : Géocodage et recherche d'adresses
- **Geopf** : Service officiel français de géocodage

### Données médicaments et actualités
- **Base Medic'AM** : Données officielles CNAM des médicaments remboursés
- **NewsAPI** : Actualités du secteur pharmaceutique français

## 🔧 Configuration

### Variables d'environnement (optionnel)

Créer un fichier `.env` pour le serveur backend :

```env
NEWSAPI_KEY=votre_cle_newsapi
PORT=8080
```

## 📱 Fonctionnalités détaillées

### Applications natives
- **iOS** : App Store ready avec géolocalisation native
- **Android** : Google Play ready avec permissions natives
- **Géolocalisation** : API native haute précision
- **Performance** : Optimisée pour mobile et tablette

### Recherche de pharmacies
- Géolocalisation automatique
- Recherche par adresse avec autocomplétion
- Filtrage par rayon (1-20 km)
- Pharmacies de garde et 24h/24
- Informations complètes : adresse, téléphone, horaires

### Carte interactive
- Marqueurs différenciés (normale/garde)
- Popups détaillées
- Centrage automatique
- Recherche dans la zone visible

### Tendances médicaments
- Analyse comparative mensuelle
- Top des médicaments en croissance
- Données officielles CNAM
- Bonus "buzz actualité"

### Actualités pharmaceutiques
- News secteur pharmacie/santé
- Sources fiables françaises
- Mise à jour quotidienne

## 🎨 Design

- **Design moderne** avec gradients et animations
- **Interface intuitive** avec navigation par onglets
- **Responsive design** mobile-first
- **Accessibilité** respectée
- **Performance optimisée**

## 🔒 Confidentialité

- **Conformité RGPD**
- **Gestion des cookies** granulaire
- **Géolocalisation optionnelle**
- **Pas de tracking** sans consentement

## 🚀 Déploiement

### Apps natives (iOS/Android)
```bash
# Build pour les stores
npm run build:native

# iOS - Archive pour App Store
npm run cap:open:ios
# Puis dans Xcode : Product > Archive

# Android - Build APK/AAB
npm run cap:open:android
# Puis dans Android Studio : Build > Generate Signed Bundle/APK
```

### Build de production
```bash
npm run build
```

### Déploiement sur Netlify/Vercel
Le projet est prêt pour un déploiement sur les plateformes modernes :
- Build automatique avec `npm run build`
- Fichiers statiques dans `/dist`
- Configuration SPA incluse

## 🤝 Contribution

Les contributions sont les bienvenues ! 

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- **OpenStreetMap** pour les données géographiques
- **CNAM** pour les données Medic'AM
- **IGN** pour les services Geopf
- **NewsAPI** pour les actualités
- La communauté open source

## 📞 Contact

- **Email** : contact@francepharmacies.fr
- **GitHub** : [france-pharmacies](https://github.com/votre-username/france-pharmacies)

---

Fait avec ❤️ pour faciliter l'accès aux soins en France