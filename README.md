# France Pharmacies

Application universelle de recherche de pharmacies en France avec géolocalisation, compatible web, mobile et tablettes natives.

## 🚀 Fonctionnalités

- **Recherche de pharmacies** par géolocalisation ou adresse
- **Filtres avancés** : rayon, horaires, pharmacies de garde
- **Carte interactive** avec marqueurs personnalisés
- **Tendances médicaments** basées sur les données CNAM
- **Actualités pharmaceutiques** en temps réel
- **Application universelle** : iPhone, iPad, Android phones et tablettes
- **Interface adaptative** : Optimisée pour chaque taille d'écran

## 📱 Déploiement Multi-Plateforme

### Web (Bolt.new)
```bash
npm run dev    # Développement
npm run build  # Production
```

### Applications Natives (Capacitor)
```bash
# Installation des dépendances Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android @capacitor/device @capacitor/network @capacitor/keyboard @capacitor/toast @capacitor/haptics

# Build web
npm run build

# Initialisation Capacitor
npx cap init

# Ajout des plateformes (support universel automatique)
npx cap add ios
npx cap add android

# Synchronisation
npx cap sync

# Ouverture dans les IDEs natifs
npx cap open ios     # Xcode (iPhone + iPad)
npx cap open android # Android Studio (Phone + Tablet)
```

## 📱 Support Universel

### iOS (iPhone + iPad)
- **iPhone** : Interface compacte avec navigation bottom
- **iPad** : Interface desktop avec sidebar et contrôles agrandis
- **Détection automatique** : Adaptation selon la taille d'écran
- **Orientation** : Portrait et paysage supportés

### Android (Phone + Tablet)
- **Téléphones** : Interface mobile optimisée
- **Tablettes** : Interface étendue avec plus d'espace
- **Responsive** : Adaptation fluide selon la résolution
- **Material Design** : Respect des guidelines Android

## 🔧 Configuration Native

### iOS (Info.plist)
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Cette app utilise votre localisation pour trouver les pharmacies près de chez vous.</string>
<key>UISupportedInterfaceOrientations</key>
<array>
  <string>UIInterfaceOrientationPortrait</string>
  <string>UIInterfaceOrientationLandscapeLeft</string>
  <string>UIInterfaceOrientationLandscapeRight</string>
</array>
<key>UISupportedInterfaceOrientations~ipad</key>
<array>
  <string>UIInterfaceOrientationPortrait</string>
  <string>UIInterfaceOrientationPortraitUpsideDown</string>
  <string>UIInterfaceOrientationLandscapeLeft</string>
  <string>UIInterfaceOrientationLandscapeRight</string>
</array>
```

### Android (AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.VIBRATE" />

<!-- Support tablettes et téléphones -->
<supports-screens 
    android:smallScreens="true"
    android:normalScreens="true" 
    android:largeScreens="true"
    android:xlargeScreens="true"
    android:anyDensity="true" />
```

## 🌐 Compatibilité

- **Web** : Tous navigateurs modernes
- **iOS** : iOS 13+ (iPhone 6s+, iPad Air 2+, iPad mini 4+)
- **Android** : Android 7+ (API 24+, toutes tailles d'écran)
- **Tablettes** : iPad (toutes tailles), Android tablets 7"+
- **Géolocalisation** : GPS natif haute précision sur mobile/tablette

## 🎨 Interface Adaptative

### Détection Automatique
- **Taille d'écran** : Small, Medium, Large, XLarge
- **Type d'appareil** : Phone, Tablet, Desktop
- **Orientation** : Portrait/Paysage avec adaptation
- **Densité** : Support haute résolution (Retina, etc.)

### Optimisations par Appareil
- **Téléphones** : Navigation bottom, interface compacte
- **Tablettes** : Sidebar, contrôles agrandis, plus d'informations
- **Desktop** : Interface complète avec tous les panneaux

## 📊 APIs Utilisées

- **Overpass API** : Données pharmacies OpenStreetMap
- **Nominatim** : Géocodage et recherche d'adresses
- **Medic'AM (CNAM)** : Tendances médicaments
- **NewsAPI** : Actualités pharmaceutiques
- **Capacitor APIs** : Géolocalisation, Device, Network, Haptics

## 🔒 Confidentialité

- **RGPD compliant** avec gestion des cookies (web uniquement)
- **Géolocalisation** : Demande d'autorisation explicite
- **Données** : Aucune donnée personnelle stockée
- **Permissions minimales** : Seulement ce qui est nécessaire

## 🏪 Distribution

### App Store (iOS)
- **iPhone** : Catégorie Santé & Forme
- **iPad** : Support natif avec interface optimisée
- **Universal Binary** : Une seule app pour tous les appareils iOS

### Google Play Store (Android)
- **Téléphones** : Toutes tailles d'écran supportées
- **Tablettes** : Interface adaptée aux grandes écrans
- **APK universel** : Compatible avec tous les appareils Android