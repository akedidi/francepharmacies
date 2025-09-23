import React, { useState, useEffect } from 'react';
import { MapPin, List, Loader2, AlertCircle, Filter, X, TrendingUp, Newspaper } from 'lucide-react';
import { Pharmacy, SearchParams } from './types/pharmacy';
import { OverpassService } from './services/overpassApi';
import { NominatimService } from './services/nominatimApi';
import { useGeolocation } from './hooks/useGeolocation';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import PharmacyList from './components/PharmacyList';
import MapView from './components/MapView';
import Footer from './components/Footer';
import TrendsTab from './components/TrendsTab';
import NewsTab from './components/NewsTab';
import CookieBanner from './components/CookieBanner';
import CookieSettings from './components/CookieSettings';
import { useCookieConsent } from './hooks/useCookieConsent';

function App() {
  const { location, loading: geoLoading, error: geoError } = useGeolocation();
  const {
    showBanner,
    preferences,
    acceptAll,
    acceptNecessaryOnly,
    savePreferences,
    resetConsent,
    setShowBanner,
  } = useCookieConsent();
  
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'trends' | 'news'>(() => {
    const savedViewMode = localStorage.getItem('france-pharmacies-view-mode');
    return (savedViewMode as 'map' | 'list' | 'trends' | 'news') || 'map';
  });
  const [currentAddress, setCurrentAddress] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchingInZone, setIsSearchingInZone] = useState(false);
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  
  const [searchParams, setSearchParams] = useState<SearchParams>({
    location: { lat: 46.603354, lon: 1.888334 }, // Center of France
    address: '',
    radius: 10,
    filterByTime: false,
    showOnlyGuard: false,
    currentTime: new Date().toTimeString().slice(0, 5),
  });

  // Sauvegarder l'onglet actif dans localStorage
  const handleViewModeChange = (newViewMode: 'map' | 'list' | 'trends' | 'news') => {
    setViewMode(newViewMode);
    localStorage.setItem('france-pharmacies-view-mode', newViewMode);
  };

  // Update location when geolocation is available
  useEffect(() => {
    if (location) {
      setSearchParams(prev => ({ ...prev, location }));
      // Get address for current location
      NominatimService.reverseGeocode(location.lat, location.lon)
        .then(address => setCurrentAddress(address))
        .catch(() => setCurrentAddress('Position actuelle'));
    }
  }, [location]);

  // Search effect with debouncing - only search if we have a specific location
  useEffect(() => {
    if (searchParams.location && (location || currentAddress)) {
      const timeoutId = setTimeout(() => {
        searchPharmacies();
      }, 500); // Reduced debounce for better UX
      
      return () => clearTimeout(timeoutId);
    }
  }, [searchParams, location, currentAddress]);

  const searchPharmacies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await OverpassService.searchPharmacies(
        searchParams.location.lat,
        searchParams.location.lon,
        searchParams.radius,
        searchParams.showOnlyGuard
      );

      // Filter by opening hours if needed
      let filteredResults = results;
      if (searchParams.filterByTime) {
        // This is a simplified implementation
        // In a real app, you'd need more sophisticated opening hours parsing
        filteredResults = results.filter(pharmacy => 
          pharmacy.isOpen24h || 
          !pharmacy.openingHours || 
          pharmacy.openingHours.includes('Mo-Su') ||
          pharmacy.openingHours === '24/7'
        );
      }

      setPharmacies(filteredResults);
    } catch (err) {
      setError('Erreur lors de la recherche des pharmacies. Veuillez réessayer.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (lat: number, lon: number, address: string) => {
    setSearchParams(prev => ({ 
      ...prev, 
      location: { lat, lon },
      address 
    }));
    setCurrentAddress(address);
  };

  const handleCurrentLocation = () => {
    if (location) {
      handleLocationSelect(location.lat, location.lon, 'Position actuelle');
    }
  };

  const handleClearAddress = () => {
    setCurrentAddress('');
    setSearchParams(prev => ({ 
      ...prev, 
      location: { lat: 46.603354, lon: 1.888334 }, // Reset to center of France
      address: '' 
    }));
    setPharmacies([]);
  };

  const handleFilterChange = (updates: Partial<SearchParams>) => {
    setSearchParams(prev => ({ ...prev, ...updates }));
  };

  const handleMapLocationClick = (lat: number, lon: number) => {
    handleViewModeChange('map');
    // The map will automatically center on this location
  };

  const handleMapMove = (lat: number, lon: number) => {
    // Empêcher le mouvement de carte pendant la recherche
    setIsSearchingInZone(true);

    // Mettre à jour les paramètres de recherche
    setSearchParams(prev => ({ 
      ...prev, 
      location: { lat, lon }
    }));
    
    // Mettre à jour l'adresse
    NominatimService.reverseGeocode(lat, lon)
      .then(address => {
        setCurrentAddress(address);
        // Réactiver le mouvement de carte après la recherche
        setTimeout(() => setIsSearchingInZone(false), 1500);
      })
      .catch(() => {
        setCurrentAddress('Nouvelle zone');
        setTimeout(() => setIsSearchingInZone(false), 1500);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <div className={`hidden lg:block bg-white/90 backdrop-blur-xl shadow-xl border-b border-gray-100/50 sticky top-0 z-40 ${(viewMode === 'trends' || viewMode === 'news') ? 'pb-4' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 lg:py-6">
          {/* Desktop Header */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-3 rounded-2xl mr-4 shadow-lg">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    France Pharmacies
                  </h1>
                  <p className="text-gray-600 font-medium">Trouvez rapidement une pharmacie près de chez vous</p>
                </div>
              </div>
              
              {/* Desktop View Toggle */}
              <div className="flex bg-gray-100/80 backdrop-blur-sm rounded-2xl p-1 shadow-inner">
                <button
                  onClick={() => handleViewModeChange('map')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    viewMode === 'map'
                      ? 'bg-white text-emerald-600 shadow-lg scale-105'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <MapPin className="w-5 h-5 inline mr-2" />
                  Carte
                </button>
                <button
                  onClick={() => handleViewModeChange('list')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white text-emerald-600 shadow-lg scale-105'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <List className="w-5 h-5 inline mr-2" />
                  Liste
                </button>
                <button
                  onClick={() => handleViewModeChange('trends')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    viewMode === 'trends'
                      ? 'bg-white text-purple-600 shadow-lg scale-105'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <TrendingUp className="w-5 h-5 inline mr-2" />
                  Tendances
                </button>
                <button
                  onClick={() => handleViewModeChange('news')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    viewMode === 'news'
                      ? 'bg-white text-blue-600 shadow-lg scale-105'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Newspaper className="w-5 h-5 inline mr-2" />
                  Actualités
                </button>
              </div>
            </div>
          </div>

          {/* Afficher la barre de recherche seulement pour les onglets 1 et 2 */}
          {(viewMode === 'map' || viewMode === 'list') && (
            <SearchBar
              onLocationSelect={handleLocationSelect}
              onCurrentLocation={handleCurrentLocation}
              onClearAddress={handleClearAddress}
              currentAddress={currentAddress}
            />
          )}
          
          {/* Geolocation status */}
          {geoLoading && (viewMode === 'map' || viewMode === 'list') && (
            <div className="mt-4 flex items-center justify-center text-sm text-gray-600 bg-blue-50/50 backdrop-blur-sm rounded-2xl py-3 px-4">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span className="font-medium">Localisation en cours...</span>
            </div>
          )}
          
          {geoError && (viewMode === 'map' || viewMode === 'list') && (
            <div className="mt-4 flex items-center justify-center text-sm text-orange-600 bg-orange-50/50 backdrop-blur-sm rounded-2xl py-3 px-4">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="font-medium">{geoError} - Vous pouvez rechercher par adresse</span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className={`lg:hidden bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100/50 sticky top-0 z-40 pb-safe ${(viewMode === 'trends' || viewMode === 'news') ? 'hidden' : ''}`}>
        <div className="px-4 py-4">
          <SearchBar
            onLocationSelect={handleLocationSelect}
            onCurrentLocation={handleCurrentLocation}
            onClearAddress={handleClearAddress}
            currentAddress={currentAddress}
          />
          
          {/* Mobile Filter Button */}
          {(viewMode === 'map' || viewMode === 'list') && (
            <button
              onClick={() => setShowFilters(true)}
              className="w-full bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl px-4 py-3 flex items-center justify-center text-gray-700 hover:bg-white hover:shadow-xl transition-all duration-200 shadow-lg hover:scale-[1.02] active:scale-[0.98] mt-4"
            >
              <Filter className="w-5 h-5 mr-2" />
              <span className="font-medium">Filtres</span>
              {(searchParams.filterByTime || searchParams.showOnlyGuard || searchParams.radius !== 10) && (
                <span className="ml-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-xs px-2 py-1 rounded-full shadow-sm">
                  Actifs
                </span>
              )}
            </button>
          )}
          
          {/* Geolocation status mobile */}
          {geoLoading && (
            <div className="mt-3 flex items-center justify-center text-sm text-gray-600 bg-blue-50/50 backdrop-blur-sm rounded-2xl py-2 px-4">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span className="font-medium">Localisation...</span>
            </div>
          )}
          
          {geoError && (
            <div className="mt-3 flex items-center justify-center text-sm text-orange-600 bg-orange-50/50 backdrop-blur-sm rounded-2xl py-2 px-4">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="font-medium">Recherchez par adresse</span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 z-50 pb-safe">
        <div className="grid grid-cols-4 px-2 py-2">
          <button
            onClick={() => handleViewModeChange('map')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 ${
              viewMode === 'map'
                ? 'bg-emerald-50 text-emerald-600'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <MapPin className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Carte</span>
          </button>
          <button
            onClick={() => handleViewModeChange('list')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 ${
              viewMode === 'list'
                ? 'bg-emerald-50 text-emerald-600'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <List className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Liste</span>
          </button>
          <button
            onClick={() => handleViewModeChange('trends')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 ${
              viewMode === 'trends'
                ? 'bg-purple-50 text-purple-600'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <TrendingUp className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Tendances</span>
          </button>
          <button
            onClick={() => handleViewModeChange('news')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 ${
              viewMode === 'news'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Newspaper className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Actu</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`max-w-7xl mx-auto px-4 py-8 ${(viewMode === 'trends' || viewMode === 'news') ? 'pb-4' : 'pb-28'} lg:pb-8`}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar - Hidden on mobile */}
          <div className={`hidden lg:block lg:col-span-1 ${(viewMode === 'trends' || viewMode === 'news') ? 'lg:hidden' : ''}`}>
            <div className="sticky top-32">
              <FilterPanel
                radius={searchParams.radius}
                onRadiusChange={(radius) => handleFilterChange({ radius })}
                filterByTime={searchParams.filterByTime}
                onFilterByTimeChange={(filterByTime) => handleFilterChange({ filterByTime })}
                showOnlyGuard={searchParams.showOnlyGuard}
                onShowOnlyGuardChange={(showOnlyGuard) => handleFilterChange({ showOnlyGuard })}
              />

              {/* Stats avec design moderne */}
              {!loading && (
                <div className="mt-6 bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-gray-100/50">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></div>
                    Résultats en temps réel (limite 100)
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-2xl">
                      <span className="text-gray-700 font-medium">Total pharmacies</span>
                      <span className="font-bold text-emerald-600 text-lg">{pharmacies.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-2xl">
                      <span className="text-gray-700 font-medium">Pharmacies de garde</span>
                      <span className="font-bold text-orange-600 text-lg">
                        {pharmacies.filter(p => p.isGuard).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl">
                      <span className="text-gray-700 font-medium">Ouvert 24h/24</span>
                      <span className="font-bold text-blue-600 text-lg">
                        {pharmacies.filter(p => p.isOpen24h).length}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Area */}
          <div className={`col-span-1 ${(viewMode === 'trends' || viewMode === 'news') ? 'lg:col-span-4' : 'lg:col-span-3'}`}>
            {error && (
              <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl flex items-center shadow-lg">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                <span className="text-red-800 font-medium">{error}</span>
              </div>
            )}

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-gray-100/50">
              {viewMode === 'map' ? (
                <div className="h-[400px] lg:h-[700px] overflow-hidden">
                  <MapView
                    pharmacies={pharmacies}
                    center={searchParams.location}
                    userLocation={location}
                    onPharmacyClick={(pharmacy) => {
                      // Switch to list view and scroll to pharmacy
                      handleViewModeChange('list');
                    }}
                    onMapMove={handleMapMove}
                    isSearchingInZone={isSearchingInZone}
                  />
                </div>
              ) : viewMode === 'list' ? (
                <div className="p-6">
                  <PharmacyList
                    pharmacies={pharmacies}
                    loading={loading}
                    onLocationClick={handleMapLocationClick}
                  />
                </div>
              ) : viewMode === 'trends' ? (
                <TrendsTab />
              ) : viewMode === 'news' ? (
                <NewsTab />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer onCookieSettings={() => setShowCookieSettings(true)} />

      {/* Mobile Filter Modal avec animations */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
        showFilters 
          ? 'opacity-100 pointer-events-auto' 
          : 'opacity-0 pointer-events-none'
      }`}>
        {/* Backdrop avec animation */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            showFilters ? 'bg-opacity-60' : 'bg-opacity-0'
          }`}
          onClick={() => setShowFilters(false)}
        />
        
        {/* Panel coulissant */}
        <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-500 ease-out ${
          showFilters ? 'translate-y-0' : 'translate-y-full'
        }`}>
          {/* Handle bar */}
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>
          
          <div className="max-h-[85vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Filtres de recherche
              </h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-3 hover:bg-gray-100 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <FilterPanel
                radius={searchParams.radius}
                onRadiusChange={(radius) => handleFilterChange({ radius })}
                filterByTime={searchParams.filterByTime}
                onFilterByTimeChange={(filterByTime) => handleFilterChange({ filterByTime })}
                showOnlyGuard={searchParams.showOnlyGuard}
                onShowOnlyGuardChange={(showOnlyGuard) => handleFilterChange({ showOnlyGuard })}
              />
              
              {/* Stats avec design moderne */}
              {!loading && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-3xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></div>
                    Résultats en temps réel (limite 100)
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-white rounded-2xl shadow-sm">
                      <div className="text-2xl font-bold text-emerald-600">{pharmacies.length}</div>
                      <div className="text-xs text-gray-600 mt-1">Total</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-2xl shadow-sm">
                      <div className="text-2xl font-bold text-orange-600">
                        {pharmacies.filter(p => p.isGuard).length}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">De garde</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-2xl shadow-sm">
                      <div className="text-2xl font-bold text-blue-600">
                        {pharmacies.filter(p => p.isOpen24h).length}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">24h/24</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
              >
                <Filter className="w-5 h-5 mr-2" />
                Appliquer les filtres
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Banner */}
      <CookieBanner
        show={showBanner}
        preferences={preferences}
        onAcceptAll={acceptAll}
        onAcceptNecessary={acceptNecessaryOnly}
        onSavePreferences={savePreferences}
        onClose={() => setShowBanner(false)}
      />

      {/* Cookie Settings Modal */}
      <CookieSettings
        show={showCookieSettings}
        preferences={preferences}
        onSave={(prefs) => {
          savePreferences(prefs);
          setShowCookieSettings(false);
        }}
        onClose={() => setShowCookieSettings(false)}
        onReset={() => {
          resetConsent();
          setShowCookieSettings(false);
        }}
      />
    </div>
  );
}

export default App;