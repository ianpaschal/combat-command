import { supabase } from '~/supabaseClient';
import { CreateTournamentCompetitorInput } from './createTournamentCompetitor';

const tableName = 'tournament_competitors' as const;

export type UpdateTournamentCompetitorInput = Partial<CreateTournamentCompetitorInput> & {
  id: string;
};

export const updateTournamentCompetitor = async ({ id, ...input }: UpdateTournamentCompetitorInput) => {
  const { data, error } = await supabase.from(tableName).update(input).eq('id', id).select().single();
  if (error) {
    throw error;
  }
  return data;
};
