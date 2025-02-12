import { useQuery } from '@tanstack/react-query';

import { convertNulls } from '~/utils/nullsToUndefined';
import { applySupabaseFilters } from '../utils/applySupabaseFilters';
import { fetchPlayerBaseQuery, FetchPlayerResponse } from './fetchPlayerBaseQuery';

/**
 * Input params for useFetchPlayerList
 */
export interface FetchPlayerListParams {}

const paramsColumnMap: Record<keyof FetchPlayerListParams, string|string[]> = {};

export type FetchPlayerListResponse = FetchPlayerResponse[];

/**
 * Query hook to fetch list of players.
 * 
 * @param params 
 * @param enabled
 */
export const useFetchPlayerList = (
  params: FetchPlayerListParams,
  enabled?: boolean,
) => useQuery({
  queryKey: ['match_results', 'list', params],
  queryFn: async (): Promise<FetchPlayerListResponse> => {
    const { data, error } = await applySupabaseFilters(fetchPlayerBaseQuery, params, paramsColumnMap);
    if (error) {
      throw error;
    }
    return convertNulls(data);
  },
  enabled,
});