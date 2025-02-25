import { supabase } from '~/supabaseClient';
import { Tables } from '~/types/__generated__/database.types';
import { GameSystemConfigRow } from '~/types/db';

const tableName = 'tournaments' as const;

export type FetchTournamentItem = Tables<typeof tableName> & {
  game_system_config: GameSystemConfigRow;
};

export const fetchTournament = async (id: string) => {
  const { data, error } = await supabase.from(tableName).select(`
    *,
    game_system_config: game_system_configs (*)  
  `).eq('id', id).single();
  if (error) {
    throw error;
  }
  return data as FetchTournamentItem; // TODO: Figure out how to avoid this cast. Better type generation from Supabase?
};
