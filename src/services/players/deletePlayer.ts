import { supabase } from '~/supabaseClient';

const tableName = 'players' as const;

export const deletePlayer = async (id: string) => {
  const { error } = await supabase.from(tableName).delete().eq('id', id);
  if (error) {
    throw error;
  }
  return null;
};
