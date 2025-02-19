import { useQuery } from '@tanstack/react-query';

import { supabase } from '~/supabaseClient';
import { TournamentDeep } from '~/types/db';

export const fetchTournamentFull = async (id: string): Promise<TournamentDeep> => {
  const { data, error } = await supabase
    .from('tournaments')
    .select(`
      *,
      game_system_config: game_system_configs (*),
      pairings: tournament_pairings (*),
      competitors: tournament_competitors (
        *,
        players (
          *,
          profile: user_profiles_secure!user_profile_id (*)
        )
      ),
      timers: tournament_timers!left (*)
    `)
    .eq('id', id)
    .eq('timers.tournament_id', id)
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const useFetchTournamentFull = (id?: string) => useQuery({
  queryKey: ['tournaments', id],
  queryFn: id ? () => fetchTournamentFull(id) : undefined,
  enabled: !!id,
});
