import { useQuery } from '@tanstack/react-query';

import { convertNulls } from '~/utils/nullsToUndefined';
import { applySupabaseFilters, FilterColumnMapping } from '../utils/applySupabaseFilters';
import { fetchMatchResultBaseQuery, MatchResultRowFilterableRow } from './fetchMatchResultBaseQuery';

/**
 * Input params for useFetchMatchResultList.
 */
export interface FetchMatchResultListParams {
  tournamentId?: string;
  round?: number;
  userProfileId?: string;
  tournamentCompetitorId?: string;
}

const paramsColumnMap: FilterColumnMapping<FetchMatchResultListParams> = {
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

export type FetchMatchResultListResponse = MatchResultRowFilterableRow[];

/**
 * Query hook to fetch list of match results.
 * 
 * @param params 
 * @param enabled
 */
export const useFetchMatchResultList = (
  params?: FetchMatchResultListParams,
  enabled?: boolean,
) => useQuery({
  queryKey: ['match_results', 'list', params],
  queryFn: async (): Promise<FetchMatchResultListResponse> => {
    const { data, error } = await applySupabaseFilters(fetchMatchResultBaseQuery, paramsColumnMap, params);
    if (error) {
      throw error;
    }
    return convertNulls(data);
  },
  enabled,
});
