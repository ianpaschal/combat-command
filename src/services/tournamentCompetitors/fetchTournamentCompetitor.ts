import { useQuery } from '@tanstack/react-query';

import { getFetcher, getListFetcher } from '~/services/factory/getFetcher';
import { supabase } from '~/supabaseClient';
import {
  PlayerRow,
  TournamentCompetitorRow,
  UserProfileSecureRow,
} from '~/types/db';

/**
 * Response for a tournament competitor row with relevant tables adjoined.
 */
export interface FetchTournamentCompetitorResponse extends TournamentCompetitorRow {
  players: PlayerRow & {
    user_profile: UserProfileSecureRow;
  }[];
}

/**
 * Base query used to fetch a single tournament competitor as well as a list of tournament competitors.
 * This MUST be manually kept in sync with the FetchTournamentCompetitorResponse type!
 */
const baseQuery = supabase.from('tournament_competitors').select(`
  *,
  players(
    *,
    user_profile: user_profiles_secure!profile_id (*)
  )
`);

export const fetchTournamentCompetitor = getFetcher<FetchTournamentCompetitorResponse>(baseQuery);

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
export interface FetchTournamentCompetitorListParams {}

export const fetchTournamentCompetitorList = getListFetcher<FetchTournamentCompetitorListParams, FetchTournamentCompetitorResponse>(baseQuery, {});

/**
 * Query hook to fetch list of tournament competitors.
 * 
 * @param params 
 * @param enabled
 */
export const useFetchTournamentCompetitorList = (
  params: FetchTournamentCompetitorListParams,
  enabled?: boolean,
) => useQuery({
  queryKey: ['tournament_competitors', 'list', params],
  queryFn: () => fetchTournamentCompetitorList(params),
  enabled,
});