import { supabase } from '~/supabaseClient';
import { CreateTournamentPairingInput } from './createTournamentPairing';

const tableName = 'tournament_pairings' as const;

export type UpdateTournamentPairingInput = Partial<CreateTournamentPairingInput> & {
  id: string;
};

export const updateTournamentPairing = async ({ id, ...input }: UpdateTournamentPairingInput) => {
  const { data, error } = await supabase.from(tableName).update(input).eq('id', id).select().single();
  if (error) {
    throw error;
  }
  return data;
};
