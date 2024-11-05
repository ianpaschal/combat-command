import { useQuery } from '@tanstack/react-query';

import { supabase } from '~/supabaseClient';
import {
  GameSystemConfigRow,
  MatchResultRow,
  PlayerRow,
  UserProfileSecureRow,
} from '~/types/db';

export interface MatchResultFullResponse extends MatchResultRow {
  game_system_config: GameSystemConfigRow;
  players: (
    PlayerRow & {
      profile: UserProfileSecureRow;
    }
  )[];
}

export const fetchMatchResultFull = async (id: string): Promise<MatchResultFullResponse> => {
  const { data, error } = await supabase
    .from('match_results')
    .select(`
      *,
      game_system_config: game_system_configs (data),
      players: match_players (
        *,
        profile: user_profiles!user_id (*)
      )
    `)
    .eq('id', id)
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const useFetchMatchResultFull = (id: string) => useQuery({
  queryKey: ['match_result_full', id],
  queryFn: () => fetchMatchResultFull(id),
  enabled: !!id,
});