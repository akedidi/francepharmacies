import { useState, useEffect } from 'react';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = 'france-pharmacies-cookie-consent';
const COOKIE_PREFERENCES_KEY = 'france-pharmacies-cookie-preferences';

export const useCookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);

    if (!consent) {
      // Délai pour éviter l'affichage immédiat
      setTimeout(() => setShowBanner(true), 2000);
    }

    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Erreur lors du parsing des préférences cookies:', error);
      }
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    
    setPreferences(allAccepted);
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(allAccepted));
    setShowBanner(false);
    
    // Initialiser les services analytics/marketing si acceptés
    initializeServices(allAccepted);
  };

  const acceptNecessaryOnly = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    
    setPreferences(necessaryOnly);
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(necessaryOnly));
    setShowBanner(false);
  };

  const savePreferences = (newPreferences: CookiePreferences) => {
    const finalPreferences = {
      ...newPreferences,
      necessary: true, // Les cookies nécessaires sont toujours activés
    };
    
    setPreferences(finalPreferences);
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(finalPreferences));
    setShowBanner(false);
    
    initializeServices(finalPreferences);
  };

  const resetConsent = () => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    localStorage.removeItem(COOKIE_PREFERENCES_KEY);
    setShowBanner(true);
    setPreferences({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  const initializeServices = (prefs: CookiePreferences) => {
    // Ici vous pouvez initialiser Google Analytics, Facebook Pixel, etc.
    if (prefs.analytics) {
      console.log('Initialisation des cookies analytics');
      // Exemple: gtag('config', 'GA_MEASUREMENT_ID');
    }
    
    if (prefs.marketing) {
      console.log('Initialisation des cookies marketing');
      // Exemple: fbq('init', 'FACEBOOK_PIXEL_ID');
    }
  };

  return {
    showBanner,
    preferences,
    acceptAll,
    acceptNecessaryOnly,
    savePreferences,
    resetConsent,
    setShowBanner,
  };
};