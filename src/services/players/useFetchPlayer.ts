import { useQuery } from '@tanstack/react-query';

import { fetchPlayerBaseQuery, FetchPlayerResponse } from './fetchPlayerBaseQuery';

/**
 * Query hook to fetch list of player.
 * 
 * @param id - The ID of the player.
 * @param enabled
 */
export const useFetchPlayer = (
  id: string,
  enabled?: boolean,
) => useQuery({
  queryKey: ['players', 'single', id],
  queryFn: async (): Promise<FetchPlayerResponse> => {
    const { data, error } = await fetchPlayerBaseQuery.eq('id', id).single();
    if (error) {
      throw error;
    }
    return data;
  },
  enabled,
});