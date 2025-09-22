import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import { Pharmacy } from '../types/pharmacy';
import { MapPin, Phone, Clock, Shield, ExternalLink, Mail, Globe, Search, Loader2 } from 'lucide-react';
import { NominatimService } from '../services/nominatimApi';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const pharmacyIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" fill="#10b981" stroke="#ffffff" stroke-width="2"/>
      <path d="M16 8v16M8 16h16" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `),
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

const guardPharmacyIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>
      <path d="M16 8v16M8 16h16" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
      <circle cx="22" cy="10" r="6" fill="#ffffff"/>
      <path d="M20 10l2 2 4-4" stroke="#dc2626" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

const userLocationIcon = new Icon({
  iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="24" height="32">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 20 12 20s12-12.8 12-20C24 5.4 18.6 0 12 0z" fill="#2563eb"/>
      <circle cx="12" cy="12" r="6" fill="white"/>
      <circle cx="12" cy="12" r="3" fill="#2563eb"/>
    </svg>
  `),
  iconSize: [24, 32],
  iconAnchor: [12, 32],
  popupAnchor: [0, -32],
});

interface MapViewProps {
  pharmacies: Pharmacy[];
  center: { lat: number; lon: number };
  userLocation?: { lat: number; lon: number } | null;
  onPharmacyClick?: (pharmacy: Pharmacy) => void;
  onMapMove?: (lat: number, lon: number) => void;
  isSearchingInZone?: boolean;
}

// Component to handle map updates
const MapUpdater: React.FC<{ 
  center: { lat: number; lon: number }; 
  pharmacies: Pharmacy[];
  onMapMove?: (lat: number, lon: number) => void;
  setShowSearchButton: (show: boolean) => void;
  setCurrentMapCenter: (center: { lat: number; lon: number }) => void;
  isSearchingInZone: boolean;
}> = ({ 
  center, 
  pharmacies,
  onMapMove,
  setShowSearchButton,
  setCurrentMapCenter,
  isSearchingInZone
}) => {
  const map = useMap();
  const isInitializedRef = useRef(false);
  const lastUpdateRef = useRef({ lat: center.lat, lon: center.lon });
  
  useEffect(() => {
    if (isSearchingInZone) {
      return; // Ne pas bouger la carte pendant la recherche dans la zone
    }

    if (pharmacies.length > 0) {
      // Fit map to show all pharmacies
      const bounds = new LatLngBounds(
        pharmacies.map(p => [p.lat, p.lon])
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    } else {
      // Center on provided location
      map.setView([center.lat, center.lon], 13);
    }
    isInitializedRef.current = true;
    lastUpdateRef.current = center;
  }, [map, center, pharmacies, isSearchingInZone]);

  useEffect(() => {
    if (isSearchingInZone || !isInitializedRef.current) {
      return;
    }

    // Calculer la distance avec la dernière mise à jour
    const distance = Math.sqrt(
      Math.pow(center.lat - lastUpdateRef.current.lat, 2) + 
      Math.pow(center.lon - lastUpdateRef.current.lon, 2)
    );
    
    // Ne pas bouger si le changement est trop petit (évite les micro-mouvements)
    if (distance < 0.005) {
      return;
    }

    lastUpdateRef.current = center;
    map.setView([center.lat, center.lon], 13);
  }, [map, center, isSearchingInZone]);

  useEffect(() => {
    if (isSearchingInZone) {
      return;
    }
    const handleMoveEnd = () => {
      const mapCenter = map.getCenter();
      const newCenter = { lat: mapCenter.lat, lon: mapCenter.lng };
      setCurrentMapCenter(newCenter);
      
      // Calculer la distance entre le centre initial et le nouveau centre
      const distance = Math.sqrt(
        Math.pow(newCenter.lat - center.lat, 2) + 
        Math.pow(newCenter.lon - center.lon, 2)
      );
      
      // Afficher le bouton si on s'est déplacé de plus de 0.005 degrés
      setShowSearchButton(distance > 0.005);
    };


    map.on('moveend', handleMoveEnd);
    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [map, center, setShowSearchButton, setCurrentMapCenter, isSearchingInZone]);

  return null;
};

const MapView: React.FC<MapViewProps> = ({ 
  pharmacies, 
  center, 
  userLocation,
  onPharmacyClick,
  onMapMove,
  isSearchingInZone = false
}) => {
  const [pharmacyAddresses, setPharmacyAddresses] = React.useState<Record<string, string>>({});
  const [loadingAddresses, setLoadingAddresses] = React.useState<Record<string, boolean>>({});
  const [showSearchButton, setShowSearchButton] = React.useState(false);
  const [currentMapCenter, setCurrentMapCenter] = React.useState({ lat: center.lat, lon: center.lon });

  const getImprovedAddress = async (pharmacy: Pharmacy) => {
    // Si on a déjà l'adresse ou qu'elle est en cours de chargement, ne pas refaire l'appel
    if (pharmacyAddresses[pharmacy.id] || loadingAddresses[pharmacy.id]) {
      return pharmacyAddresses[pharmacy.id] || pharmacy.address;
    }

    // Si l'adresse Overpass semble complète, l'utiliser
    if (isCompleteAddress(pharmacy.address)) {
      return pharmacy.address;
    }

    // Marquer comme en cours de chargement
    setLoadingAddresses(prev => ({ ...prev, [pharmacy.id]: true }));

    try {
      const improvedAddress = await NominatimService.reverseGeocode(pharmacy.lat, pharmacy.lon);
      if (improvedAddress && improvedAddress !== 'Adresse inconnue') {
        setPharmacyAddresses(prev => ({ ...prev, [pharmacy.id]: improvedAddress }));
        setLoadingAddresses(prev => ({ ...prev, [pharmacy.id]: false }));
        return improvedAddress;
      }
    } catch (error) {
      console.warn('Erreur lors de la récupération de l\'adresse:', error);
    }

    setLoadingAddresses(prev => ({ ...prev, [pharmacy.id]: false }));
    return pharmacy.address;
  };

  const isCompleteAddress = (address: string): boolean => {
    // Vérifier si l'adresse contient au minimum une rue et une ville/code postal
    const hasStreet = /\d+.*rue|avenue|boulevard|place|impasse|chemin/i.test(address);
    const hasCityOrPostal = /\d{5}|\w+ville|\w+sur\w+/i.test(address);
    return hasStreet && hasCityOrPostal;
  };

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
    const frenchHours = hours
      .replace(/Mo/g, 'Lun')
      .replace(/We/g, 'Mer')
      .replace(/Th/g, 'Jeu')
      .replace(/Fr/g, 'Ven')
      .replace(/Su/g, 'Dim')
      .replace(/Mo-Su/g, 'Lun-Dim')
      .replace(/Mo-Fr/g, 'Lun-Ven')
      .replace(/Sa-Su/g, 'Sam-Dim');
    
    return frenchHours;
  };

  return (
    <div className="h-full w-full rounded-3xl overflow-hidden">
      {/* Bouton de recherche dans cette zone */}
      {showSearchButton && onMapMove && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000] lg:top-4 lg:bottom-auto">
          <button
            onClick={() => onMapMove(currentMapCenter.lat, currentMapCenter.lon)}
            disabled={isSearchingInZone}
            className="bg-white shadow-lg rounded-full px-3 py-2 lg:px-4 lg:py-2 flex items-center gap-2 text-xs lg:text-sm font-medium hover:shadow-xl transition-all duration-200 border border-gray-200"
          >
            {isSearchingInZone ? (
              <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
            ) : (
              <Search className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
            )}
            <span className="hidden sm:inline">Rechercher dans cette zone</span>
            <span className="sm:hidden">Rechercher ici</span>
          </button>
        </div>
      )}
      
      <MapContainer
        center={[center.lat, center.lon]}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapUpdater 
          center={center} 
          pharmacies={pharmacies} 
          onMapMove={onMapMove}
          setShowSearchButton={setShowSearchButton}
          setCurrentMapCenter={setCurrentMapCenter}
          isSearchingInZone={isSearchingInZone}
        />
        
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lon]}
            icon={userLocationIcon}
          >
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-blue-600 mb-1">Votre position</div>
                <div className="text-sm text-gray-600">Position actuelle</div>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Pharmacy markers */}
        {pharmacies.map((pharmacy) => (
          <Marker
            key={pharmacy.id}
            position={[pharmacy.lat, pharmacy.lon]}
            icon={pharmacy.isGuard || pharmacy.isOpen24h ? guardPharmacyIcon : pharmacyIcon}
          >
            <Popup 
              maxWidth={300} 
              className="custom-popup"
            >
              <div className="min-w-[300px] max-w-[350px]">
                {/* Header avec nom et distance */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center flex-wrap">
                    <span className="mr-2">{pharmacy.name}</span>
                    {pharmacy.isGuard && (
                      <Shield className="w-4 h-4 text-orange-600" title="Pharmacie de garde" />
                    )}
                    {pharmacy.isOpen24h && (
                      <Clock className="w-4 h-4 text-green-600" title="Ouvert 24h/24" />
                    )}
                  </h3>
                  {pharmacy.distance && (
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm flex-shrink-0">
                      {formatDistance(pharmacy.distance)}
                    </div>
                  )}
                </div>

                {/* Adresse */}
                <div className="flex items-start text-gray-700 mb-4">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
                  <span className="text-sm leading-relaxed">
                    {pharmacy.address}
                  </span>
                </div>

                {/* Informations de contact */}
                <div className="space-y-2.5 mb-4">
                  {pharmacy.phone && (
                    <div className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                      <Phone className="w-4 h-4 mr-2 text-gray-500" />
                      <a 
                        href={`tel:${pharmacy.phone}`}
                        className="text-sm font-medium"
                      >
                        {pharmacy.phone}
                      </a>
                    </div>
                  )}
                  
                  {pharmacy.website && (
                    <div className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                      <Globe className="w-4 h-4 mr-2 text-gray-500" />
                      <a 
                        href={pharmacy.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium"
                      >
                        Site web
                      </a>
                    </div>
                  )}
                </div>

                {/* Horaires */}
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm">{formatOpeningHours(pharmacy.openingHours)}</span>
                </div>

                {/* Badges de statut */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {pharmacy.isGuard && (
                    <span className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                      <Shield className="w-3 h-3 inline mr-1" />
                      Pharmacie de garde
                    </span>
                  )}
                  {pharmacy.isOpen24h && (
                    <span className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                      <Clock className="w-3 h-3 inline mr-1" />
                      24h/24
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.lat},${pharmacy.lon}`, '_blank')}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Itinéraire
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;