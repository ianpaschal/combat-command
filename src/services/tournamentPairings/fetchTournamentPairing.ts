import { useQuery } from '@tanstack/react-query';

import { getFetcher, getListFetcher } from '~/services/factory/getFetchHandler';
import { supabase } from '~/supabaseClient';
import {
  PlayerRow,
  TournamentCompetitorRow,
  TournamentPairingRow,
  UserProfileSecureRow,
} from '~/types/db';

/**
 * Response for a tournament pairing row with relevant tables adjoined.
 */
export interface FetchTournamentPairingResponse extends TournamentPairingRow {
  competitor_0: TournamentCompetitorRow & {
    players: (PlayerRow & {
      user_profile: UserProfileSecureRow;
    })[];
  };
  competitor_1: TournamentCompetitorRow & {
    players: (PlayerRow & {
      user_profile: UserProfileSecureRow;
    })[];
  };
}

/**
 * Base query used to fetch a single tournament pairing as well as a list of tournament pairings.
 * This MUST be manually kept in sync with the FetchTournamentPairingResponse type!
 */
const baseQuery = supabase.from('tournament_pairings').select(`
  *,
  competitor_0: tournament_competitors!competitor_0_id (
    *,
    players (
      *,
      user_profile: user_profiles_secure!user_profile_id (*)
    )
  ),
  competitor_1: tournament_competitors!competitor_1_id (
    *,
    players (
      *,
      user_profile: user_profiles_secure!user_profile_id (*)
    )
  )
`);

/**
 * Fetches a single tournament pairing from the database.
 */
export const fetchTournamentPairing = getFetcher<FetchTournamentPairingResponse>(baseQuery);

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
export const fetchTournamentPairingList = getListFetcher<FetchTournamentPairingListParams, FetchTournamentPairingResponse>(baseQuery, {
  tournamentId: 'tournament_id',
});

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
