import { useState, useEffect } from 'react';

// Détection de l'environnement
const isNativeApp = () => {
  return (
    typeof window !== 'undefined' &&
    (window.navigator.userAgent.includes('FrancePharmaciesApp') ||
     // @ts-ignore - Capacitor/Cordova detection
     window.Capacitor ||
     // @ts-ignore - React Native detection
     window.ReactNativeWebView ||
     // @ts-ignore - Ionic detection
     window.Ionic)
  );
};

// Interface pour la géolocalisation native
interface NativeGeolocation {
  getCurrentPosition: (
    success: (position: GeolocationPosition) => void,
    error: (error: GeolocationPositionError) => void,
    options?: PositionOptions
  ) => void;
  watchPosition?: (
    success: (position: GeolocationPosition) => void,
    error: (error: GeolocationPositionError) => void,
    options?: PositionOptions
  ) => number;
  clearWatch?: (watchId: number) => void;
}

// Fonction pour obtenir l'API de géolocalisation appropriée
const getGeolocationAPI = (): NativeGeolocation | null => {
  if (typeof window === 'undefined') return null;
  
  // Priorité à l'API native si disponible
  // @ts-ignore - API native Capacitor
  if (window.Capacitor?.Plugins?.Geolocation) {
    return {
      getCurrentPosition: (success, error, options) => {
        // @ts-ignore
        window.Capacitor.Plugins.Geolocation.getCurrentPosition(options)
          .then((position: any) => {
            success({
              coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                altitude: position.coords.altitude,
                altitudeAccuracy: position.coords.altitudeAccuracy,
                heading: position.coords.heading,
                speed: position.coords.speed,
              },
              timestamp: position.timestamp,
            } as GeolocationPosition);
          })
          .catch(error);
      }
    };
  }
  
  // @ts-ignore - API native React Native
  if (window.ReactNativeWebView?.postMessage) {
    return {
      getCurrentPosition: (success, error, options) => {
        const requestId = Math.random().toString(36).substr(2, 9);
        
        // Écouter la réponse
        const handleMessage = (event: MessageEvent) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'geolocation' && data.requestId === requestId) {
              window.removeEventListener('message', handleMessage);
              if (data.success) {
                success(data.position);
              } else {
                error(data.error);
              }
            }
          } catch (e) {
            // Ignorer les messages non JSON
          }
        };
        
        window.addEventListener('message', handleMessage);
        
        // Envoyer la demande
        // @ts-ignore
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'getCurrentPosition',
          requestId,
          options
        }));
        
        // Timeout de sécurité
        setTimeout(() => {
          window.removeEventListener('message', handleMessage);
          error({
            code: 3,
            message: 'Timeout',
            PERMISSION_DENIED: 1,
            POSITION_UNAVAILABLE: 2,
            TIMEOUT: 3
          } as GeolocationPositionError);
        }, (options?.timeout || 10000));
      }
    };
  }
  
  // Fallback vers l'API web standard
  if (navigator.geolocation) {
    return navigator.geolocation;
  }
  
  return null;
};

interface LocationState {
  location: { lat: number; lon: number } | null;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<LocationState>({
    location: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const geolocationAPI = getGeolocationAPI();
    
    if (!geolocationAPI) {
      setState({
        location: null,
        loading: false,
        error: isNativeApp() 
          ? 'La géolocalisation n\'est pas disponible sur cet appareil.'
          : 'La géolocalisation n\'est pas supportée par ce navigateur.',
      });
      return;
    }

    const success = (position: GeolocationPosition) => {
      setState({
        location: {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        },
        loading: false,
        error: null,
      });
    };

    const error = (error: GeolocationPositionError) => {
      let errorMessage = isNativeApp() 
        ? 'Erreur de localisation' 
        : 'Erreur de géolocalisation';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = isNativeApp()
            ? 'Autorisation de localisation refusée. Vérifiez les paramètres de l\'app.'
            : 'Autorisation de géolocalisation refusée';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = isNativeApp()
            ? 'Position non disponible. Vérifiez que le GPS est activé.'
            : 'Position non disponible';
          break;
        case error.TIMEOUT:
          errorMessage = isNativeApp()
            ? 'Délai d\'attente dépassé. Réessayez.'
            : 'Délai d\'attente dépassé';
          break;
      }

      setState({
        location: null,
        loading: false,
        error: errorMessage,
      });
    };

    // Options optimisées selon l'environnement
    const options: PositionOptions = {
      enableHighAccuracy: isNativeApp() ? true : true,
      timeout: isNativeApp() ? 15000 : 10000, // Plus de temps sur mobile
      maximumAge: 300000, // 5 minutes
    };

    geolocationAPI.getCurrentPosition(success, error, options);
  }, []);

  return state;
};