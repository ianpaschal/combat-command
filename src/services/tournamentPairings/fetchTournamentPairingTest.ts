import { useQuery } from '@tanstack/react-query';

import { supabase } from '~/supabaseClient';
import { TournamentPairingFilterableRow } from '~/types/db';

export const fetchTournamentPairingTest = async (id: string): Promise<TournamentPairingFilterableRow[]> => {
  const { data, error } = await supabase
    .from('tournament_pairings_filterable')
    .select('*')
    .contains('user_profile_ids', [id]);
  if (error) {
    throw error;
  }
  return data;
};

export const useFetchTournamentPairingTest = (id?: string) => useQuery({
  queryKey: ['tournament_pairings_test', id],
  queryFn: id ? () => fetchTournamentPairingTest(id) : undefined,
  enabled: !!id,
});
