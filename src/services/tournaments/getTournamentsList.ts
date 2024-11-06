import { useQuery } from '@tanstack/react-query';

import { supabase } from '~/supabaseClient';
import { TournamentRow } from '~/types/db';
import { FowV4GameSystemConfig } from '~/types/fowV4/fowV4GameSystemConfigSchema';

export type GetTournamentsListItem = TournamentRow & {
  game_system_config: {
    data: FowV4GameSystemConfig
  }
};

export const getTournamentsList = async (): Promise<GetTournamentsListItem[]> => {
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

export const useGetTournamentsList = () => useQuery({
  queryKey: ['tournaments_list'],
  queryFn: getTournamentsList,
});