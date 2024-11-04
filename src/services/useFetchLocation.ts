import { useQuery } from '@tanstack/react-query';

import { OSMLocationSearchResultItem } from '~/services/useLocationSearch';

const fetchLocation = async (placeId: string): Promise<OSMLocationSearchResultItem[]> => {
  const response = await fetch(`https://nominatim.openstreetmap.org/lookup?osm_ids=${placeId}&format=json`);
  if (!response.ok) {
    throw new Error('Failed to fetch location by place_id');
  }
  return response.json();
};

export const useFetchLocation = (placeId?: string) => useQuery({
  queryKey:  ['location', placeId],
  queryFn: placeId ? () => fetchLocation(placeId) : undefined,
  enabled: !!placeId,
});
