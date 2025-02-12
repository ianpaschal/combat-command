import { useQuery } from '@tanstack/react-query';

import { applySupabaseFilters } from '../utils/applySupabaseFilters';
import { fetchMatchResultBaseQuery, FetchMatchResultResponse } from './fetchMatchResultBaseQuery';

/**
 * Input params for useFetchMatchResultList
 */
export interface FetchMatchResultListParams {
  tournamentId?: string;
  round?: number;
  userProfileId?: string;
  tournamentCompetitorId?: string;
}

const paramsColumnMap: Record<keyof FetchMatchResultListParams, string|string[]> = {
  tournamentId: 'pairing.tournament_id',
  round: 'pairing.round_index',
  userProfileId: [
    'player_0.user_profile.id',
    'player_1.user_profile.id',
  ],
  tournamentCompetitorId: [
    'player_0.tournament_competitor.id',
    'player_1.tournament_competitor.id',
  ],
};

export type FetchMatchResultListResponse = FetchMatchResultResponse[];

/**
 * Query hook to fetch list of match results.
 * 
 * @param params 
 * @param enabled 
 * @returns 
 */
export const useFetchMatchResultList = (
  params: FetchMatchResultListParams,
  enabled?: boolean,
) => useQuery({
  queryKey: ['match_results', 'list', params],
  queryFn: async (): Promise<FetchMatchResultListResponse> => {
    const { data, error } = await applySupabaseFilters(fetchMatchResultBaseQuery, params, paramsColumnMap);
    if (error) {
      throw error;
    }
    return data;
  },
  enabled,
});