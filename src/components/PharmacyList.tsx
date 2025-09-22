import React from 'react';
import { Pharmacy } from '../types/pharmacy';
import PharmacyCard from './PharmacyCard';
import { MapPin } from 'lucide-react';

interface PharmacyListProps {
  pharmacies: Pharmacy[];
  loading: boolean;
  onLocationClick: (lat: number, lon: number) => void;
}

const PharmacyList: React.FC<PharmacyListProps> = ({ 
  pharmacies, 
  loading, 
  onLocationClick 
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-10 bg-gray-200 rounded-xl flex-1"></div>
              <div className="h-10 bg-gray-200 rounded-xl flex-1"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (pharmacies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Aucune pharmacie trouvée
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Essayez d'élargir votre rayon de recherche ou de modifier vos filtres pour trouver des pharmacies dans votre zone.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Pharmacies autour de vous
        </h2>
      </div>
      
      <div className="flex flex-col items-center gap-4 sm:gap-6">
        {pharmacies.map((pharmacy) => (
          <PharmacyCard
            key={pharmacy.id}
            pharmacy={pharmacy}
            onLocationClick={onLocationClick}
          />
        ))}
      </div>
    </div>
  );
};

export default PharmacyList;