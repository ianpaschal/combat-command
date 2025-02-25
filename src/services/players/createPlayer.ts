import { supabase } from '~/supabaseClient';
import { Tables } from '~/types/__generated__/database.types';

const tableName = 'players' as const;

export type CreatePlayerInput = Omit<Tables<typeof tableName>, 'id'|'created_at'|'updated_at'>;

export const createPlayer = async (input: CreatePlayerInput|CreatePlayerInput[]) => {
  const isBulk = Array.isArray(input);
  const query = supabase.from(tableName).insert(isBulk ? input : [input]).select();
  const { data, error } = await (isBulk ? query : query.single());
  if (error) {
    throw error;
  }
  return data;
};
