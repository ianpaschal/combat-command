import { supabase } from '~/supabaseClient';
import { CreatePlayerInput } from './createPlayer';

const tableName = 'players' as const;

export type UpdatePlayerInput = Partial<CreatePlayerInput> & {
  id: string;
};

export const updatePlayer = async ({ id, ...input }: UpdatePlayerInput) => {
  const { data, error } = await supabase.from(tableName).update(input).eq('id', id).select().single();
  if (error) {
    throw error;
  }
  return data;
};
