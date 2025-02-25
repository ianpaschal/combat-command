import { supabase } from '~/supabaseClient';
import { Tables } from '~/types/__generated__/database.types';

const tableName = 'tournaments' as const;

export type CreateTournamentInput = Omit<Tables<typeof tableName>, 'id'|'created_at'|'updated_at'>;

export const createTournament = async (input: CreateTournamentInput|CreateTournamentInput[]) => {
  const isBulk = Array.isArray(input);
  const query = supabase.from(tableName).insert(isBulk ? input : [input]).select();
  const { data, error } = await (isBulk ? query : query.single());
  if (error) {
    throw error;
  }
  return data;
};
