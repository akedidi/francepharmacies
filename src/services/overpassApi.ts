import { Pharmacy } from '../types/pharmacy';

const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';
const GEOPF_API_URL = 'https://data.geopf.fr/geocodage';

export class OverpassService {
  private static async fetchWithRetry(
    url: string,
    options: RequestInit,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<Response> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);
        
        // If we get a 504 Gateway Timeout, retry
        if (response.status === 504 && attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
          console.warn(`Overpass API timeout (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        return response;
      } catch (error) {
        lastError = error as Error;
        
        // If it's a network error and we have retries left, try again
        if (attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt);
          console.warn(`Network error (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`, error);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
    }
    
    throw lastError!;
  }

  static async searchPharmacies(
    lat: number,
    lon: number,
    radius: number,
    showOnlyGuard: boolean = false,
    filterByTime: boolean = false
  ): Promise<Pharmacy[]> {
    const radiusInMeters = radius * 1000;
    
    let query = `
      [out:json][timeout:90];
      (
        node["amenity"="pharmacy"](around:${radiusInMeters},${lat},${lon});
        way["amenity"="pharmacy"](around:${radiusInMeters},${lat},${lon});
      );
      out center;
    `;

    if (showOnlyGuard) {
      query = `
        [out:json][timeout:90];
        (
          node["amenity"="pharmacy"]["note"~"garde"](around:${radiusInMeters},${lat},${lon});
          node["amenity"="pharmacy"]["opening_hours"~"24/7"](around:${radiusInMeters},${lat},${lon});
          way["amenity"="pharmacy"]["note"~"garde"](around:${radiusInMeters},${lat},${lon});
          way["amenity"="pharmacy"]["opening_hours"~"24/7"](around:${radiusInMeters},${lat},${lon});
        );
        out center;
      `;
    }

    try {
      const response = await this.fetchWithRetry(OVERPASS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const pharmacies: Pharmacy[] = [];
      
      // Traiter d'abord toutes les pharmacies avec les données Overpass
      for (const element of data.elements) {
        const tags = element.tags || {};
        const coords = element.type === 'way' ? element.center : { lat: element.lat, lon: element.lon };
        
        let address = this.formatAddress(tags);
        
        pharmacies.push({
          id: element.id.toString(),
          name: tags.name || 'Pharmacie',
          address: address,
          phone: tags.phone || tags['contact:phone'],
          openingHours: tags.opening_hours,
          isGuard: this.isGuardPharmacy(tags),
          isOpen24h: tags.opening_hours === '24/7',
          lat: coords.lat,
          lon: coords.lon,
          website: tags.website || tags['contact:website'],
          email: tags.email || tags['contact:email'],
          distance: this.calculateDistance(lat, lon, coords.lat, coords.lon),
        });
      }
      
      // Filtrer par horaires si demandé
      let filteredPharmacies = pharmacies;
      if (filterByTime) {
        filteredPharmacies = this.filterByOpeningHours(pharmacies);
      }
      
      // Trier par distance et limiter les résultats
      const sortedPharmacies = filteredPharmacies
        .sort((a, b) => (a.distance || 0) - (b.distance || 0))
        .slice(0, 100);
      
      // Améliorer les adresses en arrière-plan (sans bloquer l'affichage)
      this.improveAddressesInBackground(sortedPharmacies);
      
      return sortedPharmacies;
        
    } catch (error) {
      console.error('Erreur lors de la récupération des pharmacies:', error);
      return [];
    }
  }

  private static filterByOpeningHours(pharmacies: Pharmacy[]): Pharmacy[] {
    const now = new Date();
    const currentHour = now.getHours();
    const isNightTime = currentHour >= 20 || currentHour < 8;
    
    return pharmacies.filter(pharmacy => {
      // Toujours inclure les pharmacies de garde et 24h/24
      if (pharmacy.isGuard || pharmacy.isOpen24h) {
        return true;
      }
      
      // Si c'est la nuit (20h-8h) et qu'on n'a pas d'horaires, exclure
      if (isNightTime && !pharmacy.openingHours) {
        return false;
      }
      
      // Si on a des horaires, essayer de les analyser
      if (pharmacy.openingHours) {
        return this.isLikelyOpen(pharmacy.openingHours, now);
      }
      
      // Si on n'a pas d'horaires et que ce n'est pas la nuit, inclure
      return !isNightTime;
    });
  }
  
  private static isLikelyOpen(openingHours: string, now: Date): boolean {
    // Analyse simplifiée des horaires
    const hours = openingHours.toLowerCase();
    
    // 24/7 ou toujours ouvert
    if (hours.includes('24/7') || hours.includes('24h')) {
      return true;
    }
    
    // Si contient "mo-su" ou "lun-dim", probablement ouvert tous les jours
    if (hours.includes('mo-su') || hours.includes('lun-dim')) {
      return true;
    }
    
    // Pour une analyse plus poussée, on pourrait parser les horaires
    // mais c'est complexe avec les différents formats
    return true; // Par défaut, on considère comme ouvert
  }
  private static async improveAddressesInBackground(pharmacies: Pharmacy[]): Promise<void> {
    // Améliorer les adresses incomplètes en arrière-plan
    for (const pharmacy of pharmacies) {
      if (!this.isCompleteAddress(pharmacy.address)) {
        try {
          const geopfAddress = await this.getAddressFromGeopf(pharmacy.lat, pharmacy.lon);
          if (geopfAddress && geopfAddress !== 'Adresse inconnue') {
            pharmacy.address = geopfAddress;
          }
          // Délai pour éviter de surcharger l'API
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
          console.warn('Erreur lors de l\'amélioration de l\'adresse:', error);
        }
      }
    }
  }
  private static async getAddressFromGeopf(lat: number, lon: number): Promise<string> {
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
      console.error('Erreur lors du géocodage inverse avec Geopf:', error);
      return 'Adresse inconnue';
    }
  }

  private static isCompleteAddress(address: string): boolean {
    // Vérifier si l'adresse contient au minimum une rue et une ville/code postal
    const hasStreet = /\d+.*rue|avenue|boulevard|place|impasse|chemin/i.test(address);
    const hasCityOrPostal = /\d{5}|\w+ville|\w+sur\w+/i.test(address);
    return hasStreet && hasCityOrPostal;
  }

  private static formatAddress(tags: any): string {
    const addressParts = [];
    
    // Numéro et rue
    const streetParts = [];
    if (tags['addr:housenumber']) streetParts.push(tags['addr:housenumber']);
    if (tags['addr:unit']) streetParts.push(tags['addr:unit']);
    if (tags['addr:street']) streetParts.push(tags['addr:street']);
    
    if (streetParts.length > 0) {
      addressParts.push(streetParts.join(' '));
    }
    
    // Code postal et ville
    const cityParts = [];
    if (tags['addr:postcode']) cityParts.push(tags['addr:postcode']);
    if (tags['addr:city']) cityParts.push(tags['addr:city']);
    else if (tags['addr:district']) cityParts.push(tags['addr:district']);
    
    if (cityParts.length > 0) {
      addressParts.push(cityParts.join(' '));
    }
    
    // Si on n'a rien trouvé, essayer les fallbacks
    if (addressParts.length === 0) {
      if (tags.addr) return tags.addr;
      if (tags.address) return tags.address;
      if (tags.name) return `Près de ${tags.name}`;
      return 'Adresse non disponible';
    }
    
    return addressParts.join(', ');
  }

  private static isGuardPharmacy(tags: any): boolean {
    const note = tags.note?.toLowerCase() || '';
    const description = tags.description?.toLowerCase() || '';
    return note.includes('garde') || description.includes('garde') || tags.opening_hours === '24/7';
  }

  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRad(value: number): number {
    return (value * Math.PI) / 180;
  }
}