import { useQuery } from '@tanstack/react-query';

import { supabase } from '~/supabaseClient';
import { GameSystemConfigRow } from '~/types/db';

/**
 * Query hook to fetch a game system config.
 * 
 * @param id - The ID of the game system config. 
 * @param enabled
 */
export const useFetchGameSystemConfig = (
  id: string,
  enabled?: boolean,
) => useQuery({
  queryKey: ['game_system_configs', 'single', id],
  queryFn: async (): Promise<GameSystemConfigRow> => {
    const { data, error } = await supabase.from('game_system_configs').select('*').eq('id', id).single();
    if (error) {
      throw error;
    }
    return data;
  },
  enabled,
});