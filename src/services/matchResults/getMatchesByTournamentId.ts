import { useQuery } from '@tanstack/react-query';

import { supabase } from '~/supabaseClient';
import { MatchResultDeep } from '~/types/db';

/**
 * Fetch Tournament Pairings for a given tournament (by ID).
 * @param tournamentId 
 * @returns 
 */
export const getMatchesByUserId = async (
  params: GetMatchesParams,
): Promise<MatchResultDeep[]> => {
  const query = supabase
    .from('match_results')
    .select(`
      *,
      player_0: players!player_0_id (
        *,
        profile: user_profiles_secure!profile_id (*),
        competitor: tournament_competitors!tournament_competitor_id (*)
      ),
      player_1: players!player_1_id (
        *,
        profile: user_profiles_secure!profile_id (*),
        competitor: tournament_competitors!tournament_competitor_id (*)
      ),
      pairing: tournament_pairings!inner (*)
    `);

  // Apply filters
  Object.entries(params).forEach(([key, value]) => {
    if (!!value && key === 'tournamentId') {
      query.eq('pairing.tournament_id', value);
    }
    if (!!value && key === 'round') {
      query.eq('pairing.round_index', value);
    }
  });

  const { data, error } = await query;
  if (error) {
    throw error;
  }
  return data;
};

export interface GetMatchesParams {
  tournamentId?: string | null;
  round?: number | null;
}

/**
 * Query hook to fetch Tournament Pairings for a given tournament (by ID).
 * @param tournamentId 
 * @param enabled 
 * @returns 
 */
export const useGetMatchesByTournamentId = (
  params: GetMatchesParams,
  enabled?: boolean,
) => useQuery({
  queryKey: ['matches_by_tournament_id_list', params],
  queryFn: () => getMatchesByUserId(params),
  enabled,
});