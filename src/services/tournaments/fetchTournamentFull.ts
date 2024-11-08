import { useQuery } from '@tanstack/react-query';

import { supabase } from '~/supabaseClient';
import { TournamentDeep } from '~/types/db';

export const fetchTournamentFull = async (id: string): Promise<TournamentDeep> => {
  const { data, error } = await supabase
    .from('tournaments')
    .select(`
      *,
      game_system_config: game_system_configs (data),
      pairings: tournament_pairings (
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
      ),
      competitors: tournament_competitors (
        *,
        players (
          *,
          profile: user_profiles_secure!profile_id (*)
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
  queryKey: ['tournament_full', id],
  queryFn: id ? () => fetchTournamentFull(id) : undefined,
  enabled: !!id,
});