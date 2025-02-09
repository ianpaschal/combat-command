import { useQuery } from '@tanstack/react-query';

import { getMapboxAccessToken, getMapboxSessionToken } from '~/services/mapbox/mapboxToken';

// Source: https://docs.mapbox.com/api/search/search-box/#response-get-suggested-results
export interface MapboxPlace {
  name: string;
  mapbox_id: string;
  feature_type: string;
  place_formatted: string;
  language: string;
}

const suggestLocation = async (query: string): Promise<MapboxPlace[]> => {
  const response = await fetch(
    `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(query)}&session_token=${getMapboxSessionToken()}&access_token=${getMapboxAccessToken()}`,
  );
  if (!response.ok) throw new Error('Failed to fetch suggestions');
  const data = await response.json();
  return data.suggestions || [];
};

export const useSuggestLocation = (query?: string) => useQuery({
  queryKey: ['mapbox_suggestions', query],
  queryFn: query ? () => suggestLocation(query) : undefined,
  enabled: !!query,
});