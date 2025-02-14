import { supabase } from '~/supabaseClient';

export const getCreator = <T extends object, V extends object>(tableName: string) => {
  async function create(input: T): Promise<V>;
  async function create(input: T[]): Promise<V[]>;
  async function create(input: T | T[]): Promise<V | V[]> {
    const query = supabase.from(tableName).insert(input).select();
    if (!Array.isArray(input)) {
      query.single();
    }
    const { data, error } = await query;
    if (error) {
      throw error;
    }
    return data;
  }
  return create;
};
