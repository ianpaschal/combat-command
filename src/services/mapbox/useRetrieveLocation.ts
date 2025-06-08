import { SearchBoxFeatureSuggestion } from '@mapbox/search-js-core';
import { useQuery } from '@tanstack/react-query';

import { getMapboxParams } from '~/services/mapbox/getMapboxParams';

export const retrieveLocation = async (mapboxPlaceId: string): Promise<SearchBoxFeatureSuggestion | null> => {
  const response = await fetch(
    `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxPlaceId}?${getMapboxParams()}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch place details');
  }
  const { features } = await response.json();
  return features[0] || null;
};

export const useRetrieveLocation = (mapboxPlaceId?: string) => useQuery({
  queryKey: ['mapbox_retrieve', mapboxPlaceId],
  queryFn: async (): Promise<SearchBoxFeatureSuggestion | null> => {
    const response = await fetch(
      `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxPlaceId}?${getMapboxParams()}`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch place details');
    }
    const { features } = await response.json();
    return features[0] || null;
  },
  enabled: !!mapboxPlaceId,
});
