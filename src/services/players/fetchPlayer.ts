import { useQuery } from '@tanstack/react-query';

import { getFetcher, getListFetcher } from '~/services/factory/getFetcher';
import { supabase } from '~/supabaseClient';
import {
  PlayerRow,
  TournamentCompetitorRow,
  UserProfileSecureRow,
} from '~/types/db';

/**
 * Response for a player row with relevant tables adjoined.
 */
export interface FetchPlayerResponse extends Omit<PlayerRow, 'details'> {
  user_profile: UserProfileSecureRow;
  tournament_competitor: TournamentCompetitorRow;
}

/**
 * Base query used to fetch a single player as well as a list of players.
 * This MUST be manually kept in sync with the FetchPlayerResponse type!
 */
const baseQuery = supabase.from('players').select(`
  *,
  user_profile: user_profiles_secure!profile_id (*),
  tournament_competitor: tournament_competitors!tournament_competitor_id (*)
`);

export const fetchPlayer = getFetcher<FetchPlayerResponse>(baseQuery);

/**
 * Query hook to fetch a single player.
 * 
 * @param id - The ID of the player.
 * @param enabled
 */
export const useFetchPlayer = (
  id: string,
  enabled?: boolean,
) => useQuery({
  queryKey: ['players', 'single', id],
  queryFn: () => fetchPlayer(id),
  enabled,
});

/**
 * Input params for fetching a player list.
 */
export interface FetchPlayerListParams {}

export const fetchPlayerList = getListFetcher<FetchPlayerListParams, FetchPlayerResponse>(baseQuery, {});

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
  queryKey: ['players', 'list', params],
  queryFn: () => fetchPlayerList(params),
  enabled,
});