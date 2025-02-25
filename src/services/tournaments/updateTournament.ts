import { supabase } from '~/supabaseClient';
import { CreateTournamentInput } from './createTournament';

const tableName = 'tournaments' as const;

export type UpdateTournamentInput = Partial<CreateTournamentInput> & {
  id: string;
};

export const updateTournament = async ({ id, ...input }: UpdateTournamentInput) => {
  const { data, error } = await supabase.from(tableName).update(input).eq('id', id).select().single();
  if (error) {
    throw error;
  }
  return data;
};
