import React, { useState } from 'react';
import { Cookie, Settings, X, Shield, BarChart3, Target, Info } from 'lucide-react';
import { CookiePreferences } from '../hooks/useCookieConsent';

interface CookieBannerProps {
  show: boolean;
  preferences: CookiePreferences;
  onAcceptAll: () => void;
  onAcceptNecessary: () => void;
  onSavePreferences: (preferences: CookiePreferences) => void;
  onClose: () => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({
  show,
  preferences,
  onAcceptAll,
  onAcceptNecessary,
  onSavePreferences,
  onClose,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [tempPreferences, setTempPreferences] = useState<CookiePreferences>(preferences);

  if (!show) return null;

  const handlePreferenceChange = (type: keyof CookiePreferences, value: boolean) => {
    if (type === 'necessary') return; // Les cookies nécessaires ne peuvent pas être désactivés
    
    setTempPreferences(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleSavePreferences = () => {
    onSavePreferences(tempPreferences);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 lg:items-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
      
      {/* Banner */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Cookie className="w-8 h-8 mr-3" />
              <div>
                <h2 className="text-2xl font-bold">Gestion des cookies</h2>
                <p className="text-emerald-100 text-sm">Nous respectons votre vie privée</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {!showDetails ? (
            /* Vue simple */
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Nous utilisons des cookies pour améliorer votre expérience sur notre site, 
                  analyser le trafic et personnaliser le contenu. Vous pouvez choisir quels 
                  cookies accepter.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Conformité RGPD</p>
                      <p>Vos données sont traitées conformément au Règlement Général sur la Protection des Données.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onAcceptAll}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Accepter tous les cookies
                </button>
                <button
                  onClick={onAcceptNecessary}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors border border-gray-300"
                >
                  Cookies nécessaires uniquement
                </button>
                <button
                  onClick={() => setShowDetails(true)}
                  className="flex-1 bg-blue-100 text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-blue-200 transition-colors border border-blue-300 flex items-center justify-center"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Personnaliser
                </button>
              </div>
            </div>
          ) : (
            /* Vue détaillée */
            <div className="p-6">
              <div className="mb-6">
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center mb-4"
                >
                  ← Retour
                </button>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Préférences détaillées</h3>
                <p className="text-gray-600 text-sm">
                  Choisissez les types de cookies que vous souhaitez autoriser.
                </p>
              </div>

              <div className="space-y-6">
                {/* Cookies nécessaires */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Shield className="w-6 h-6 text-gray-600 mr-3" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Cookies nécessaires</h4>
                        <p className="text-sm text-gray-600">Requis pour le fonctionnement du site</p>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Toujours actifs
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Ces cookies sont essentiels au fonctionnement du site. Ils permettent la navigation, 
                    la sécurité et l'accès aux zones sécurisées. Ils ne peuvent pas être désactivés.
                  </p>
                </div>

                {/* Cookies analytiques */}
                <div className="bg-white border border-gray-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <BarChart3 className="w-6 h-6 text-blue-600 mr-3" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Cookies analytiques</h4>
                        <p className="text-sm text-gray-600">Nous aident à améliorer le site</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempPreferences.analytics}
                        onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Ces cookies collectent des informations anonymes sur l'utilisation du site 
                    pour nous aider à l'améliorer (Google Analytics, statistiques de visite).
                  </p>
                </div>

                {/* Cookies marketing */}
                <div className="bg-white border border-gray-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Target className="w-6 h-6 text-purple-600 mr-3" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Cookies marketing</h4>
                        <p className="text-sm text-gray-600">Personnalisation et publicité</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempPreferences.marketing}
                        onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Ces cookies permettent de personnaliser les publicités et le contenu 
                    en fonction de vos intérêts (réseaux sociaux, publicité ciblée).
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Enregistrer mes préférences
                </button>
                <button
                  onClick={onAcceptAll}
                  className="flex-1 bg-blue-100 text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-blue-200 transition-colors border border-blue-300"
                >
                  Accepter tout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Pour plus d'informations, consultez notre{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 underline">
              politique de confidentialité
            </a>
            {' '}et nos{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 underline">
              conditions d'utilisation
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;