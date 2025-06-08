import { SearchBoxSuggestion } from '@mapbox/search-js-core';
import { useQuery } from '@tanstack/react-query';

import { getMapboxParams } from '~/services/mapbox/getMapboxParams';

export const useSuggestLocation = (query?: string) => useQuery({
  queryKey: ['mapbox_suggestions', query],
  queryFn: async (): Promise<SearchBoxSuggestion[] | undefined> => {
    if (!query) {
      return; 
    }
    const response = await fetch(
      `https://api.mapbox.com/search/searchbox/v1/suggest?${getMapboxParams(query)}`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch suggestions');
    }
    const { suggestions } = await response.json();
    return suggestions;
  },
  enabled: !!query,
});
