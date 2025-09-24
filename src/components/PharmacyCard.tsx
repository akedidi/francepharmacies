import React from 'react';
import { MapPin, Phone, Clock, Shield, ExternalLink, Mail, Globe } from 'lucide-react';
import { Pharmacy } from '../types/pharmacy';

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  onLocationClick: (lat: number, lon: number) => void;
}

const PharmacyCard: React.FC<PharmacyCardProps> = ({ pharmacy, onLocationClick }) => {
  const formatDistance = (distance?: number) => {
    if (!distance) return '';
    return distance < 1 
      ? `${Math.round(distance * 1000)} m`
      : `${distance.toFixed(1)} km`;
  };

  const formatOpeningHours = (hours?: string) => {
    if (!hours) return 'Horaires non disponibles';
    if (hours === '24/7') return 'Ouvert 24h/24';
    
    // Convertir les horaires anglais en français
    let frenchHours = hours
      .replace(/Mo/g, 'Lun')
      .replace(/Tu/g, 'Mar')
      .replace(/We/g, 'Mer')
      .replace(/Th/g, 'Jeu')
      .replace(/Fr/g, 'Ven')
      .replace(/Sa/g, 'Sam')
      .replace(/Su/g, 'Dim')
      .replace(/Mo-Su/g, 'Lun-Dim')
      .replace(/Mo-Fr/g, 'Lun-Ven')
      .replace(/Sa-Su/g, 'Sam-Dim');
    
    return frenchHours;
  };

  const getHoursDisplayStyle = (hours?: string) => {
    if (!hours) {
      return 'text-gray-500 bg-gray-100';
    }
    return 'text-gray-700';
  };

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.lat},${pharmacy.lon}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full max-w-md mx-auto sm:max-w-none bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 flex items-center flex-wrap gap-2">
            {pharmacy.name}
            {pharmacy.isGuard && (
              <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                Garde
              </span>
            )}
            {pharmacy.isOpen24h && (
              <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                24h/24
              </span>
            )}
          </h3>
          
          <div className="flex items-start text-gray-700 mb-3">
            <MapPin className="w-4 h-4 mt-1 mr-3 flex-shrink-0 text-emerald-600" />
            <span className="text-sm leading-relaxed font-medium">{pharmacy.address}</span>
          </div>
        </div>
        
        {/* Distance en haut à droite */}
        {pharmacy.distance && (
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold ml-2 sm:ml-4 flex-shrink-0 shadow-md">
            {formatDistance(pharmacy.distance)}
          </div>
        )}
      </div>

      {/* Informations de contact */}
      <div className="space-y-3 mb-4">
        {pharmacy.phone && (
          <div className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
              <Phone className="w-4 h-4 text-blue-600" />
            </div>
            <a 
              href={`tel:${pharmacy.phone}`}
              className="font-medium"
            >
              {pharmacy.phone}
            </a>
          </div>
        )}

        {pharmacy.email && (
          <div className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
              <Mail className="w-4 h-4 text-blue-600" />
            </div>
            <a 
              href={`mailto:${pharmacy.email}`}
              className="font-medium"
            >
              {pharmacy.email}
            </a>
          </div>
        )}

        <div className="flex items-center text-gray-700">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
            pharmacy.openingHours ? 'bg-green-50' : 'bg-gray-100'
          }`}>
            <Clock className={`w-4 h-4 ${
              pharmacy.openingHours ? 'text-green-600' : 'text-gray-400'
            }`} />
          </div>
          <span className={`text-sm font-medium ${getHoursDisplayStyle(pharmacy.openingHours)}`}>
            {formatOpeningHours(pharmacy.openingHours)}
            {!pharmacy.openingHours && (
              <span className="ml-2 text-xs text-gray-400">(horaires non disponibles)</span>
            )}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-gray-100">
        <button
          onClick={handleDirections}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-[1.02]"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Itinéraire
        </button>
      </div>

      {pharmacy.website && (
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
          <a
            href={pharmacy.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center transition-colors"
          >
            <Globe className="w-4 h-4 mr-2" />
            Site web
          </a>
        </div>
      )}
    </div>
  );
};

export default PharmacyCard;