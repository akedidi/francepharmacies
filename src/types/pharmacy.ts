export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone?: string;
  openingHours?: string;
  isGuard: boolean;
  isOpen24h: boolean;
  lat: number;
  lon: number;
  distance?: number;
  website?: string;
  email?: string;
}

export interface SearchParams {
  location: { lat: number; lon: number };
  address: string;
  radius: number;
  filterByTime: boolean;
  showOnlyGuard: boolean;
  currentTime: string;
}

export interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
}