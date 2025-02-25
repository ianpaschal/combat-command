import { supabase } from '~/supabaseClient';

const tableName = 'game_system_configs' as const;

export const deleteGameSystemConfig = async (id: string) => {
  const { error } = await supabase.from(tableName).delete().eq('id', id);
  if (error) {
    throw error;
  }
  return null;
};
