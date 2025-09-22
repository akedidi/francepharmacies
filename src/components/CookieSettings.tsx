import React, { useState } from 'react';
import { Settings, Cookie, Shield, BarChart3, Target, X } from 'lucide-react';
import { CookiePreferences } from '../hooks/useCookieConsent';

interface CookieSettingsProps {
  show: boolean;
  preferences: CookiePreferences;
  onSave: (preferences: CookiePreferences) => void;
  onClose: () => void;
  onReset: () => void;
}

const CookieSettings: React.FC<CookieSettingsProps> = ({
  show,
  preferences,
  onSave,
  onClose,
  onReset,
}) => {
  const [tempPreferences, setTempPreferences] = useState<CookiePreferences>(preferences);

  if (!show) return null;

  const handlePreferenceChange = (type: keyof CookiePreferences, value: boolean) => {
    if (type === 'necessary') return;
    
    setTempPreferences(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleSave = () => {
    onSave(tempPreferences);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Settings className="w-8 h-8 mr-3" />
              <div>
                <h2 className="text-2xl font-bold">Paramètres des cookies</h2>
                <p className="text-blue-100 text-sm">Gérez vos préférences</p>
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

        <div className="max-h-[60vh] overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Cookies nécessaires */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Shield className="w-6 h-6 text-gray-600 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Cookies nécessaires</h4>
                    <p className="text-sm text-gray-600">Requis pour le fonctionnement</p>
                  </div>
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Toujours actifs
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Navigation, sécurité, préférences de base. Ces cookies ne peuvent pas être désactivés.
              </p>
            </div>

            {/* Cookies analytiques */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <BarChart3 className="w-6 h-6 text-blue-600 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Cookies analytiques</h4>
                    <p className="text-sm text-gray-600">Statistiques d'utilisation</p>
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
                Google Analytics, mesure d'audience, amélioration de l'expérience utilisateur.
              </p>
            </div>

            {/* Cookies marketing */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Target className="w-6 h-6 text-purple-600 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Cookies marketing</h4>
                    <p className="text-sm text-gray-600">Publicité personnalisée</p>
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
                Réseaux sociaux, publicité ciblée, personnalisation du contenu.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Enregistrer
            </button>
            <button
              onClick={onReset}
              className="flex-1 bg-red-100 text-red-700 px-6 py-3 rounded-xl font-semibold hover:bg-red-200 transition-colors border border-red-300"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieSettings;