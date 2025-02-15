import { supabase } from '~/supabaseClient';

export const getUpdateHandler = <T extends { id: string }>(tableName: string) => (
  async ({ id, ...input }: T): Promise<string> => {
    const { error } = await supabase.from(tableName).update(input).eq('id', id);
    if (error) {
      throw error;
    }
    return id;
  }
);
