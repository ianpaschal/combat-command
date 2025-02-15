import { supabase } from '~/supabaseClient';

export const getDeleteHandler = (tableName: string) => (
  async (id: string): Promise<string> => {
    const { error } = await supabase.from(tableName).delete().eq('id', id);
    if (error) {
      throw error;
    }
    return id;
  }
);
