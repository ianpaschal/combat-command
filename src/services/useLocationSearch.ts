import { useQuery } from '@tanstack/react-query';

const fetchLocations = async (searchTerm: string): Promise<OSMLocationSearchResultItem[]> => {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchTerm)}&format=json`);
  if (!response.ok) {
    throw new Error('Failed to fetch locations');
  }
  return response.json();
};

export const useLocationSearch = (searchTerm: string) => useQuery({
  queryKey: ['location_search', searchTerm],
  queryFn: searchTerm ? () => fetchLocations(searchTerm) : undefined,
  enabled: !!searchTerm,
});

export interface OSMLocationSearchResultItem {
  importance: number;
  place_rank: number;
  type: string;
  class: string;
  lat: string;
  lon: string;
  osm_id: number;
  osm_type: string;
  license: string;
  place_id: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingBox: string[];
}