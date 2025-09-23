// Utilitaires pour la compatibilité native

export interface NativeEnvironment {
  isNative: boolean;
  isTablet: boolean;
  screenSize: 'small' | 'medium' | 'large' | 'xlarge';
  platform?: string;
  deviceType?: 'phone' | 'tablet' | 'desktop';
  version?: string;
  capabilities?: {
    geolocation: boolean;
    camera: boolean;
    notifications: boolean;
    storage: boolean;
    haptics: boolean;
    statusBar: boolean;
  };
}

// Détection de la taille d'écran et du type d'appareil
const detectDeviceInfo = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const maxDimension = Math.max(width, height);
  const minDimension = Math.min(width, height);
  
  // Détection tablette basée sur la taille d'écran
  const isTablet = (
    (minDimension >= 768 && maxDimension >= 1024) || // iPad standard
    (minDimension >= 820 && maxDimension >= 1180) || // iPad Air
    (minDimension >= 834 && maxDimension >= 1194) || // iPad Pro 11"
    (minDimension >= 1024 && maxDimension >= 1366)   // iPad Pro 12.9"
  );
  
  let screenSize: 'small' | 'medium' | 'large' | 'xlarge' = 'small';
  let deviceType: 'phone' | 'tablet' | 'desktop' = 'phone';
  
  if (width >= 1536) {
    screenSize = 'xlarge';
    deviceType = 'desktop';
  } else if (width >= 1024) {
    screenSize = 'large';
    deviceType = isTablet ? 'tablet' : 'desktop';
  } else if (width >= 768) {
    screenSize = 'medium';
    deviceType = isTablet ? 'tablet' : 'phone';
  } else {
    screenSize = 'small';
    deviceType = 'phone';
  }
  
  return { isTablet, screenSize, deviceType };
};

// Détection de l'environnement d'exécution
export const detectEnvironment = (): NativeEnvironment => {
  if (typeof window === 'undefined') {
    return { 
      isNative: false, 
      isTablet: false, 
      screenSize: 'medium',
      deviceType: 'desktop'
    };
  }

  // @ts-ignore - Variables globales définies dans index.html
  const appEnv = window.APP_ENV || {};
  const deviceInfo = detectDeviceInfo();
  
  const isNative = !!(
    // @ts-ignore - Capacitor (Ionic)
    window.Capacitor ||
    // @ts-ignore - React Native WebView
    window.ReactNativeWebView ||
    // @ts-ignore - Cordova
    window.cordova ||
    // @ts-ignore - Configuration native personnalisée
    appEnv.isNative
  );

  // Détection de la plateforme native
  let platform = 'web';
  if (isNative) {
    // @ts-ignore
    if (window.Capacitor?.getPlatform) {
      // @ts-ignore
      platform = window.Capacitor.getPlatform();
    } else if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
      platform = 'ios';
    } else if (navigator.userAgent.includes('Android')) {
      platform = 'android';
    }
  }

  return {
    isNative,
    isTablet: deviceInfo.isTablet,
    screenSize: deviceInfo.screenSize,
    deviceType: deviceInfo.deviceType,
    platform,
    version: appEnv.nativeConfig?.version,
    capabilities: {
      geolocation: isNative || !!navigator.geolocation,
      camera: isNative || !!navigator.mediaDevices,
      notifications: isNative || 'Notification' in window,
      storage: true, // Toujours disponible
      haptics: isNative && (platform === 'ios' || platform === 'android'),
      statusBar: isNative,
    }
  };
};

// Optimisations spécifiques aux plateformes
export const getPlatformOptimizations = () => {
  const env = detectEnvironment();
  
  return {
    // Timeouts adaptés
    geolocationTimeout: env.isNative ? (env.isTablet ? 20000 : 15000) : 10000,
    
    // Précision GPS
    enableHighAccuracy: env.isNative,
    
    // Cache des positions
    maximumAge: env.isNative ? (env.isTablet ? 120000 : 60000) : 300000,
    
    // Animations
    reducedMotion: env.isNative && env.platform === 'ios' && !env.isTablet,
    
    // Interface adaptative
    showSidebar: env.screenSize === 'large' || env.screenSize === 'xlarge',
    compactMode: env.deviceType === 'phone',
    tabletMode: env.isTablet,
    
    // Gestion des erreurs
    errorMessages: {
      geolocation: env.isNative 
        ? `Vérifiez que la localisation est activée dans les paramètres${env.isTablet ? ' de votre tablette' : ' de l\'app'}`
        : 'Autorisez la géolocalisation dans votre navigateur',
      network: env.isNative
        ? `Vérifiez votre connexion ${env.isTablet ? 'Wi-Fi ou cellulaire' : 'internet'}`
        : 'Problème de connexion réseau'
    }
  };
};

// Interface pour les communications natives
export const NativeBridge = {
  // Envoyer des données vers l'app native
  postMessage: (type: string, data: any) => {
    const env = detectEnvironment();
    
    if (!env.isNative) return false;
    
    try {
      // @ts-ignore - React Native WebView
      if (window.ReactNativeWebView?.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type, data }));
        return true;
      }
      
      // @ts-ignore - Capacitor
      if (window.Capacitor?.Plugins) {
        // Utiliser les plugins Capacitor appropriés
        return true;
      }
      
      return false;
    } catch (error) {
      console.warn('Erreur communication native:', error);
      return false;
    }
  },
  
  // Écouter les messages de l'app native
  onMessage: (callback: (type: string, data: any) => void) => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type && message.data !== undefined) {
          callback(message.type, message.data);
        }
      } catch (error) {
        // Ignorer les messages non-JSON
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }
};

// Hooks pour les fonctionnalités natives
export const useNativeFeatures = () => {
  const env = detectEnvironment();
  const optimizations = getPlatformOptimizations();
  
  return {
    environment: env,
    optimizations,
    bridge: NativeBridge,
    
    // Méthodes utilitaires
    isNative: () => env.isNative,
    getPlatform: () => env.platform,
    hasCapability: (capability: keyof NativeEnvironment['capabilities']) => 
      env.capabilities?.[capability] || false,
  };
};