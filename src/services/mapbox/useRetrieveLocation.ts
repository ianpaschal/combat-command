import { useQuery } from '@tanstack/react-query';

import { getMapboxAccessToken, getMapboxSessionToken } from '~/services/mapbox/mapboxToken';
import { MapboxPlace } from '~/services/mapbox/useSuggestLocation';

const retrieveLocation = async (placeId: string): Promise<{ properties: MapboxPlace }> => {
  const response = await fetch(
    `https://api.mapbox.com/search/searchbox/v1/retrieve/${placeId}?session_token=${getMapboxSessionToken()}&access_token=${getMapboxAccessToken()}`,
  );
  if (!response.ok) throw new Error('Failed to fetch place details');
  const data = await response.json();
  return data.features[0] || null;
};

export const useRetrieveLocation = (placeId?: string) => useQuery({
  queryKey: ['mapbox_retrieve', placeId],
  queryFn: placeId ? () => retrieveLocation(placeId) : undefined,
  enabled: !!placeId,
});