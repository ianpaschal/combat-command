import { supabase } from '~/supabaseClient';
import { CreateGameSystemConfigInput } from './createGameSystemConfig';

const tableName = 'game_system_configs' as const;

export type UpdateGameSystemConfigInput = Partial<CreateGameSystemConfigInput> & {
  id: string;
};

export const updateGameSystemConfig = async ({ id, ...input }: UpdateGameSystemConfigInput) => {
  const { data, error } = await supabase.from(tableName).update(input).eq('id', id).select().single();
  if (error) {
    throw error;
  }
  return data;
};
