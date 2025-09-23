import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.francepharmacies.app',
  appName: 'France Pharmacies',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    allowNavigation: [
      'https://nominatim.openstreetmap.org',
      'https://overpass-api.de',
      'https://data.geopf.fr'
    ]
  },
  plugins: {
    Geolocation: {
      permissions: {
        location: "whenInUse"
      }
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#10b981",
      showSpinner: false,
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: "light",
      backgroundColor: "#10b981",
      overlaysWebView: false
    },
    App: {
      launchUrl: "com.francepharmacies.app"
    },
    Keyboard: {
      resize: "body",
      style: "dark",
      resizeOnFullScreen: true
    },
    Device: {},
    Network: {},
    Toast: {}
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    backgroundColor: '#ffffff',
    allowsLinkPreview: false,
    presentationStyle: 'fullscreen',
    // Support universel iPhone/iPad
    scheme: 'France Pharmacies',
    webContentsDebuggingEnabled: false,
    minVersion: '13.0',
    // Configuration iPad spécifique
    preferredContentMode: 'mobile',
    supportsTablet: true
  },
  android: {
    backgroundColor: '#ffffff',
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    // Support universel téléphone/tablette
    minSdkVersion: 24,
    compileSdkVersion: 34,
    targetSdkVersion: 34,
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      keystorePassword: undefined,
      releaseType: 'APK',
      signingType: 'apksigner'
    }
  }
};

export default config;