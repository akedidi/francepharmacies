import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, RefreshCw } from 'lucide-react';
import { NominatimService } from '../services/nominatimApi';
import { Capacitor } from '@capacitor/core';
import { AddressSuggestion } from '../types/pharmacy';

interface SearchBarProps {
  onLocationSelect: (lat: number, lon: number, address: string) => void;
  onCurrentLocation: () => void;
  onClearAddress: () => void;
  currentAddress: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onLocationSelect,
  onCurrentLocation,
  onClearAddress,
  currentAddress,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!currentAddress || currentAddress === 'Position actuelle') {
      setQuery('');
    }
  }, [currentAddress]);

  useEffect(() => {
    const searchAddresses = async () => {
      if (query.trim().length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setLoading(true);
      try {
        const results = await NominatimService.searchAddresses(query.trim());
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Erreur de recherche:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchAddresses, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    const shortAddress = suggestion.display_name.split(',').slice(0, 2).join(',');
    setQuery(shortAddress);
    setShowSuggestions(false);
    onLocationSelect(
      parseFloat(suggestion.lat),
      parseFloat(suggestion.lon),
      shortAddress
    );
  };

  const handleClearAddress = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    onClearAddress();
  };

  return (
    <div className="relative w-full max-w-2xl" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une adresse"
          className="w-full pl-12 pr-32 py-4 text-lg border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-lg bg-white"
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {(query || currentAddress) && (
            <button
              onClick={handleClearAddress}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              title="Effacer l'adresse"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onCurrentLocation}
            className={`p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors ${
              Capacitor.isNativePlatform() ? 'animate-pulse' : ''
            }`}
            title={Capacitor.isNativePlatform() ? "Géolocalisation native" : "Ma position actuelle"}
          >
            {Capacitor.isNativePlatform() ? (
              <RefreshCw className="w-5 h-5" />
            ) : (
              <MapPin className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-80 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
              <span className="ml-2 text-gray-600">Recherche en cours...</span>
            </div>
          )}
          
          {!loading && suggestions.length === 0 && query.length >= 3 && (
            <div className="py-4 px-6 text-gray-500 text-center">
              Aucun résultat trouvé
            </div>
          )}

          {!loading && suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-6 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none first:rounded-t-2xl last:rounded-b-2xl transition-colors"
            >
              <div className="flex items-start">
                <MapPin className="w-4 h-4 text-gray-400 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700 leading-relaxed">
                  {suggestion.display_name}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;