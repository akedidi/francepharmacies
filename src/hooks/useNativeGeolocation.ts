import { useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

interface LocationState {
  location: { lat: number; lon: number } | null;
  loading: boolean;
  error: string | null;
}

export const useNativeGeolocation = () => {
  const [state, setState] = useState<LocationState>({
    location: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    getCurrentPosition();
  }, []);

  const getCurrentPosition = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Vérifier si on est sur une plateforme native
      if (Capacitor.isNativePlatform()) {
        // Demander explicitement les permissions sur mobile
        console.log('Demande de permissions de géolocalisation...');
        const permissions = await Geolocation.requestPermissions({
          permissions: ['location']
        });
        
        console.log('Permissions reçues:', permissions);
        
        if (permissions.location === 'granted' || permissions.location === 'prompt') {
          // Utiliser l'API native Capacitor
          console.log('Tentative de récupération de la position...');
          const position = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 300000 // 5 minutes
          });

          console.log('Position obtenue:', position);
          setState({
            location: {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            },
            loading: false,
            error: null,
          });
        } else {
          console.log('Permissions refusées:', permissions.location);
          setState({
            location: null,
            loading: false,
            error: 'Autorisation de géolocalisation refusée. Veuillez l\'activer dans les réglages.',
          });
        }
      } else {
        // Fallback vers l'API web standard
        if (!navigator.geolocation) {
          setState({
            location: null,
            loading: false,
            error: 'La géolocalisation n\'est pas supportée par ce navigateur.',
          });
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            setState({
              location: {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
              },
              loading: false,
              error: null,
            });
          },
          (error) => {
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
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 300000, // 5 minutes
          }
        );
      }
    } catch (error) {
      console.error('Erreur géolocalisation:', error);
      setState({
        location: null,
        loading: false,
        error: 'Erreur lors de la récupération de la position',
      });
    }
  };

  const refreshLocation = () => {
    getCurrentPosition();
  };

  return { ...state, refreshLocation };
};