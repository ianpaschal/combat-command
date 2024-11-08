import { useQuery } from '@tanstack/react-query';

import { supabase } from '~/supabaseClient';
import { MatchDeep } from '~/types/db/Matches';

export interface GetMatchesInput {
  tournamentId?: string | null;
  round?: number | null;
}

/**
 * Fetch Tournament Pairings for a given tournament (by ID).
 * @param tournamentId 
 * @returns 
 */
export const getMatches = async (
  params: GetMatchesInput,
): Promise<MatchDeep[]> => {
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
      pairing: tournament_pairings!inner (*),
      game_system_config: game_system_configs (*)
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

/**
 * Query hook to fetch Tournament Pairings for a given tournament (by ID).
 * 
 * @param params 
 * @param enabled 
 * @returns 
 */
export const useGetMatchesByTournamentId = (
  params: GetMatchesInput,
  enabled?: boolean,
) => useQuery({
  queryKey: ['matches_by_tournament_id_list', params],
  queryFn: () => getMatches(params),
  enabled,
});