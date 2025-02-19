import { useQuery } from '@tanstack/react-query';

import { getFetcher, getListFetcher } from '~/services/factory/getFetchHandler';
import { supabase } from '~/supabaseClient';
import {
  GameSystemConfigRow,
  PlayerRow,
  TournamentCompetitorRow,
  TournamentPairingRow,
  TournamentRow,
  TournamentTimerRow,
  UserProfileSecureRow,
} from '~/types/db';

/**
 * Response for a tournament row with relevant tables adjoined.
 */
export interface FetchTournamentResponse extends TournamentRow {
  game_system_config: GameSystemConfigRow;
  pairings: TournamentPairingRow[];
  competitors: (TournamentCompetitorRow & {
    players: (PlayerRow & {
      user_profile: UserProfileSecureRow;
    })[];
  })[];
  timers: TournamentTimerRow[];
}

/**
 * Base query used to fetch a single tournament as well as a list of tournaments.
 * This MUST be manually kept in sync with the FetchTournamentResponse type!
 */
const baseQuery = supabase.from('tournaments').select(`
  *,
  game_system_config: game_system_configs (*),
  pairings: tournament_pairings (*),
  competitors: tournament_competitors (
    *,
    players (
      *,
      user_profile: user_profiles_secure!user_profile_id (*)
    )
  ),
  timers: tournament_timers (*)
`);

/**
 * Fetches a single tournament from the database.
 */
export const fetchTournament = getFetcher<FetchTournamentResponse>(baseQuery);

/**
 * Query hook to fetch a single tournament.
 * 
 * @param id - The ID of the tournament.
 * @param enabled
 */
export const useFetchTournament = (
  id: string,
  enabled?: boolean,
) => useQuery({
  queryKey: ['tournaments', 'single', id],
  queryFn: () => fetchTournament(id),
  enabled,
});

/**
 * Input params for fetching a tournament list.
 */
export interface FetchTournamentListParams {}

/**
 * Fetches a list of tournaments from the database.
 */
export const fetchTournamentList = getListFetcher<FetchTournamentListParams, FetchTournamentResponse>(baseQuery, {});

/**
 * Query hook to fetch list of tournaments.
 * 
 * @param params 
 * @param enabled
 */
export const useFetchTournamentList = (
  params: FetchTournamentListParams,
  enabled?: boolean,
) => useQuery({
  queryKey: ['tournaments', 'list', params],
  queryFn: () => fetchTournamentList(params),
  enabled,
});
