import React from 'react';
import { Filter, Clock, Shield, MapPin } from 'lucide-react';

interface FilterPanelProps {
  radius: number;
  onRadiusChange: (radius: number) => void;
  filterByTime: boolean;
  onFilterByTimeChange: (filter: boolean) => void;
  showOnlyGuard: boolean;
  onShowOnlyGuardChange: (show: boolean) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  radius,
  onRadiusChange,
  filterByTime,
  onFilterByTimeChange,
  showOnlyGuard,
  onShowOnlyGuardChange,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center mb-4">
        <Filter className="w-5 h-5 text-emerald-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Filtres de recherche</h3>
      </div>

      <div className="space-y-6">
        {/* Rayon de recherche */}
        <div>
          <div className="flex items-center mb-2">
            <MapPin className="w-4 h-4 text-gray-500 mr-2" />
            <label className="text-sm font-medium text-gray-700">
              Rayon de recherche: {radius} km
            </label>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            value={radius}
            onChange={(e) => onRadiusChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-emerald"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 km</span>
            <span>20 km</span>
          </div>
        </div>

        {/* Filtrage par heure */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-gray-800">Ouvert maintenant</p>
              <p className="text-sm text-gray-600">Afficher seulement les pharmacies ouvertes</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filterByTime}
              onChange={(e) => onFilterByTimeChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Pharmacies de garde */}
        <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
          <div className="flex items-center">
            <Shield className="w-5 h-5 text-orange-600 mr-3" />
            <div>
              <p className="font-medium text-gray-800">Pharmacies de garde</p>
              <p className="text-sm text-gray-600">Ouvertes 24h/24 et pharmacies de garde</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyGuard}
              onChange={(e) => onShowOnlyGuardChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>
      </div>

      <style jsx>{`
        .slider-emerald::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider-emerald::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default FilterPanel;