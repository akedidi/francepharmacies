import { AddressSuggestion } from '../types/pharmacy';

const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org';
const GEOPF_API_URL = 'https://data.geopf.fr/geocodage';

export class NominatimService {
  static async searchAddresses(query: string): Promise<AddressSuggestion[]> {
    if (query.trim().length < 3) return [];

    try {
      const response = await fetch(
        `${NOMINATIM_API_URL}/search?format=json&q=${encodeURIComponent(query.trim())}&countrycodes=fr&limit=8&addressdetails=1&dedupe=1`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return data
        .filter((item: any) => item.display_name && item.lat && item.lon)
        .map((item: any) => ({
          display_name: item.display_name,
          lat: item.lat,
          lon: item.lon,
          place_id: item.place_id,
        }));
    } catch (error) {
      console.error('Erreur lors de la recherche d\'adresses:', error);
      return [];
    }
  }

  static async reverseGeocode(lat: number, lon: number): Promise<string> {
    try {
      const response = await fetch(
        `${GEOPF_API_URL}/reverse?lat=${lat}&lon=${lon}&index=address&limit=1`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const properties = feature.properties;
        
        // Formater l'adresse française
        const addressParts = [];
        
        // Numéro et nom de rue
        if (properties.housenumber && properties.street) {
          addressParts.push(`${properties.housenumber} ${properties.street}`);
        } else if (properties.street) {
          addressParts.push(properties.street);
        } else if (properties.name) {
          addressParts.push(properties.name);
        }
        
        // Code postal et ville
        const cityParts = [];
        if (properties.postcode) cityParts.push(properties.postcode);
        if (properties.city) cityParts.push(properties.city);
        
        if (cityParts.length > 0) {
          addressParts.push(cityParts.join(' '));
        }
        
        if (addressParts.length > 0) {
          return addressParts.join(', ');
        }
        
        // Fallback sur le label complet
        return properties.label || 'Adresse inconnue';
      }
      
      return 'Adresse inconnue';
    } catch (error) {
      console.error('Erreur lors du géocodage inverse:', error);
      return 'Adresse inconnue';
    }
  }
}