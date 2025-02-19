import { useQuery } from '@tanstack/react-query';

import { getFetcher, getListFetcher } from '~/services/factory/getFetchHandler';
import { TournamentPairingFilterableRow } from '~/types/db';

/**
 * Fetches a single tournament pairing from the database.
 */
export const fetchTournamentPairing = getFetcher<TournamentPairingFilterableRow>('tournament_pairings_filterable');

/**
 * Query hook to fetch a single tournament pairing.
 * 
 * @param id - The ID of the tournament pairing.
 * @param enabled
 */
export const useFetchTournamentPairing = (
  id: string,
  enabled?: boolean,
) => useQuery({
  queryKey: ['tournament_pairings', 'single', id],
  queryFn: () => fetchTournamentPairing(id),
  enabled,
});

/**
 * Input params for fetching a tournament pairing list.
 */
export interface FetchTournamentPairingListParams {
  tournamentId?: string;
}

/**
 * Fetches a list of tournament pairings from the database.
 */
export const fetchTournamentPairingList = getListFetcher<FetchTournamentPairingListParams, TournamentPairingFilterableRow>(
  'tournament_pairings_filterable',
  {
    tournamentId: ['tournament_id', 'equals'],
  },
);

/**
 * Query hook to fetch list of tournament pairings.
 * 
 * @param params 
 * @param enabled
 */
export const useFetchTournamentPairingList = (
  params?: FetchTournamentPairingListParams,
  enabled?: boolean,
) => useQuery({
  queryKey: ['tournament_pairings', 'list', params],
  queryFn: () => fetchTournamentPairingList(params),
  enabled,
});
