import { useState, useEffect } from 'react';

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
    if (!navigator.geolocation) {
      setState({
        location: null,
        loading: false,
        error: 'La géolocalisation n\'est pas supportée par ce navigateur.',
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
      let errorMessage = 'Erreur de géolocalisation';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Autorisation de géolocalisation refusée';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Position non disponible';
          break;
        case error.TIMEOUT:
          errorMessage = 'Délai d\'attente dépassé';
          break;
      }

      setState({
        location: null,
        loading: false,
        error: errorMessage,
      });
    };

    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    });
  }, []);

  return state;
};