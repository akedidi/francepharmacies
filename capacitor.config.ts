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
        location: "always"
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
    backgroundColor: '#ffffff'
  },
  android: {
    backgroundColor: '#ffffff',
    allowMixedContent: true,
    captureInput: true
  }
};

export default config;