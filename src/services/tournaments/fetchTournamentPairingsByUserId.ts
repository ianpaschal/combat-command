import { useQuery } from '@tanstack/react-query';

import { supabase } from '~/supabaseClient';
import { PlayerRow, TournamentCompetitorRow } from '~/types/db';
import { TournamentPairingRow } from '~/types/db/TournamentPairings';

export interface TournamentPairingsByUserIdResponse extends TournamentPairingRow {
  competitors: (TournamentCompetitorRow & {
    players: PlayerRow[];
  })[];
}

/**
 * Fetch Tournament Pairings which include the given user (by ID).
 * @param userId - The user's ID
 * @returns 
 */
export const fetchTournamentPairingsByUserId = async (
  userId: string,
): Promise<TournamentPairingsByUserIdResponse[]> => {
  const { data, error } = await supabase
    .from('tournament_pairings')
    .select(`
      *,
      competitor_0: tournament_competitors!competitor_0_id (
        *,
        players!inner (*)
      ),
      competitor_1: tournament_competitors!competitor_1_id (
        *,
        players!inner (*)
      )
    `)
    .or(`user_id.eq.${userId}`, { referencedTable: 'competitor_0.registrations' })
    .or(`user_id.eq.${userId}`, { referencedTable: 'competitor_1.registrations' });
  if (error) {
    throw error;
  }
  return data;
};

// export const fetchTournamentPairingsByUserId = async (
//   userId: string,
// ): Promise<TournamentPairingsByUserIdResponse[]> => {
//   const { data, error } = await supabase.rpc('fetch_tournament_pairings_by_user', { input_user_id: userId }); 

//   if (error) {
//     throw error;
//   }
//   return data;
// };

/**
 * Query hook to fetch Tournament Pairings which include the given user (by ID).
 * @param userId 
 * @param enabled 
 * @returns 
 */
export const useFetchTournamentPairingsByUserId = (
  userId: string | undefined,
  enabled?: boolean,
) => useQuery({
  queryKey: ['tournament_pairings_by_user_id', userId],
  queryFn: userId ? () => fetchTournamentPairingsByUserId(userId) : undefined,
  enabled: !!userId && enabled !== false,
});