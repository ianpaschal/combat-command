import { useQuery } from '@tanstack/react-query';

import { fetchMatchResultBaseQuery, FetchMatchResultResponse } from '~/services/matchResults/fetchMatchResultBaseQuery';

/**
 * Query hook to fetch list of match results.
 * 
 * @param id - The ID of the match result. 
 * @param enabled 
 * @returns 
 */
export const useFetchMatchResult = (
  id: string,
  enabled?: boolean,
) => useQuery({
  queryKey: ['match_results', 'single', id],
  queryFn: async (): Promise<FetchMatchResultResponse> => {
    const { data, error } = await fetchMatchResultBaseQuery.eq('id', id).single();
    if (error) {
      throw error;
    }
    return data;
  },
  enabled,
});