import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.francepharmacies.app',
  appName: 'France Pharmacies',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
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
      showSpinner: false
    },
    StatusBar: {
      style: "light",
      backgroundColor: "#10b981"
    }
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    backgroundColor: '#ffffff',
    allowsLinkPreview: false,
    preferredContentMode: 'mobile'
  },
  android: {
    backgroundColor: '#ffffff',
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    appendUserAgent: 'FrancePharmacies/1.0',
    overrideUserAgent: 'FrancePharmacies/1.0 Mobile'
  }
};

export default config;