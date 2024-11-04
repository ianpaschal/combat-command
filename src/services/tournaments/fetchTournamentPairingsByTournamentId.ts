import { useQuery } from '@tanstack/react-query';

import { TournamentPairingsResponse } from '~/services/tournaments/fetchTournamentPairings';
import { supabase } from '~/supabaseClient';

/**
 * Fetch Tournament Pairings for a given tournament (by ID).
 * @param tournamentId 
 * @returns 
 */
export const fetchActiveTournamentParingsByUserId = async (
  tournamentId: string,
): Promise<TournamentPairingsResponse[]> => {
  const { data, error } = await supabase
    .from('tournament_pairings')
    .select(`
      *,
      competitor_0: tournament_competitors!competitor_0_id (
        *,
        players (
          *,
          profile: user_profiles_secure!profile_id (*)
        )
      ),
      competitor_1: tournament_competitors!competitor_1_id (
        *,
        players (
          *,
          profile: user_profiles_secure!profile_id (*)
        )
      )
    `)
    .eq('tournament_id', tournamentId);
  if (error) {
    throw error;
  }
  return data;
};

/**
 * Query hook to fetch Tournament Pairings for a given tournament (by ID).
 * @param tournamentId 
 * @param enabled 
 * @returns 
 */
export const useFetchTournamentParingsByTournamentId = (
  tournamentId: string | undefined,
  enabled?: boolean,
) => useQuery({
  queryKey: ['tournament_pairings_by_tournament_id', tournamentId],
  queryFn: tournamentId ? () => fetchActiveTournamentParingsByUserId(tournamentId) : undefined,
  enabled: !!tournamentId && enabled !== false,
});