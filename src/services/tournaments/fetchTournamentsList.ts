import { useQuery } from '@tanstack/react-query';

import { supabase } from '~/supabaseClient';
import { TournamentRecord } from '~/types/Tournament';

export const fetchTournamentsList = async (): Promise<TournamentRecord[]> => {
  const { data, error } = await supabase
    .from('tournaments')
    .select(`
      *,
      game_system_config: game_system_configs (data)
    `);
  if (error) {
    throw error;
  }
  return data;
};

export const useFetchTournamentsList = () => useQuery({
  queryKey: ['tournaments_list'],
  queryFn: fetchTournamentsList,
});