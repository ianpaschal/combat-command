import { supabase } from '~/supabaseClient';

const tableName = 'tournaments' as const;

export const deleteTournament = async (id: string) => {
  const { error } = await supabase.from(tableName).delete().eq('id', id);
  if (error) {
    throw error;
  }
  return null;
};
