import { useQuery } from '@tanstack/react-query';

import { getFetcher, getListFetcher } from '~/services/factory/getFetchHandler';
import { TournamentCompetitorFilterableRow } from '~/types/db';

/**
 * Fetches a single tournament competitor from the database.
 */
export const fetchTournamentCompetitor = getFetcher<TournamentCompetitorFilterableRow>('tournament_competitors_filterable');

/**
 * Query hook to fetch a single tournament competitor.
 * 
 * @param id - The ID of the tournament competitor.
 * @param enabled
 */
export const useFetchTournamentCompetitor = (
  id: string,
  enabled?: boolean,
) => useQuery({
  queryKey: ['tournament_competitors', 'single', id],
  queryFn: () => fetchTournamentCompetitor(id),
  enabled,
});

/**
 * Input params for fetching a tournament competitor list.
 */
export interface FetchTournamentCompetitorListParams {
  tournamentId?: string;
}

/**
 * Fetches a list of tournament competitors from the database.
 */
export const fetchTournamentCompetitorList = getListFetcher<FetchTournamentCompetitorListParams, TournamentCompetitorFilterableRow>(
  'tournament_competitors_filterable',
  {
    tournamentId: ['tournament_id', 'equals'],
  },
);

/**
 * Query hook to fetch list of tournament competitors.
 * 
 * @param params 
 * @param enabled
 */
export const useFetchTournamentCompetitorList = (
  params?: FetchTournamentCompetitorListParams,
  enabled?: boolean,
) => useQuery({
  queryKey: ['tournament_competitors', 'list', params],
  queryFn: () => fetchTournamentCompetitorList(params),
  enabled,
});
