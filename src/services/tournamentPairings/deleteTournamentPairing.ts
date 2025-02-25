import { supabase } from '~/supabaseClient';

const tableName = 'tournament_pairings' as const;

export const deleteTournamentPairing = async (id: string) => {
  const { error } = await supabase.from(tableName).delete().eq('id', id);
  if (error) {
    throw error;
  }
  return null;
};
