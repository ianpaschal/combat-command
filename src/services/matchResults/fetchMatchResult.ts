import { useQuery } from '@tanstack/react-query';

import { getFetcher, getListFetcher } from '~/services/factory/getFetchHandler';
import { MatchResultFilterableRow } from '~/types/db';

/**
 * Fetches a single match result from the database.
 */
export const fetchMatchResult = getFetcher<MatchResultFilterableRow>('match_results_filterable');

/**
 * Query hook to fetch a single match result.
 * 
 * @param id - The ID of the match result.
 * @param enabled
 */
export const useFetchMatchResult = (
  id: string,
  enabled?: boolean,
) => useQuery({
  queryKey: ['match_results', 'single', id],
  queryFn: () => fetchMatchResult(id),
  enabled,
});

/**
 * Filter params for fetching a match result list.
 */
export interface FetchMatchResultListParams {
  userProfileId?: string;
  tournamentId?: string;
  gameSystemId?: string;
}

/**
 * Fetches a list of match results from the database.
 */
export const fetchMatchResultList = getListFetcher<FetchMatchResultListParams, MatchResultFilterableRow>(
  'match_results_filterable',
  {
    userProfileId: ['user_profile_ids', 'contains'],
    tournamentId: ['tournament_id', 'equals'],
    gameSystemId: ['game_system_id', 'equals'],
  },
);

/**
 * Query hook to fetch list of match results.
 * 
 * @param params 
 * @param enabled
 */
export const useFetchMatchResultList = (
  params: FetchMatchResultListParams,
  enabled?: boolean,
) => useQuery({
  queryKey: ['match_results', 'list', params],
  queryFn: () => fetchMatchResultList(params),
  enabled,
});
