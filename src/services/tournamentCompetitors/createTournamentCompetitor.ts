import { supabase } from '~/supabaseClient';
import { Tables } from '~/types/__generated__/database.types';

const tableName = 'tournament_competitors' as const;

export type CreateTournamentCompetitorInput = Omit<Tables<typeof tableName>, 'id'|'created_at'|'updated_at'>;

export const createTournamentCompetitor = async (input: CreateTournamentCompetitorInput|CreateTournamentCompetitorInput[]) => {
  const isBulk = Array.isArray(input);
  const query = supabase.from(tableName).insert(isBulk ? input : [input]).select();
  const { data, error } = await (isBulk ? query : query.single());
  if (error) {
    throw error;
  }
  return data;
};
