import { supabase } from '~/supabaseClient';
import { Tables } from '~/types/__generated__/database.types';
import { Override } from '~/types/db';

const tableName = 'game_system_configs' as const;

export type FetchGameSystemConfigItem = Override<Tables<typeof tableName>, {
  id: string;
  created_at: string;
}>;

export const fetchGameSystemConfig = async (id: string) => {
  const { data, error } = await supabase.from(tableName).select('*').eq('id', id).single();
  if (error) {
    throw error;
  }
  return data as FetchGameSystemConfigItem; // TODO: Figure out how to avoid this cast. Better type generation from Supabase?
};
