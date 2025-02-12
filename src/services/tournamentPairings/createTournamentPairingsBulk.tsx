import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from '~/services/handleError';
import { supabase } from '~/supabaseClient';
import { TournamentPairingInput } from '~/types/db/TournamentPairings';

export type CreateTournamentPairingsBulkInput = {
  tournamentId: string;
  pairings: TournamentPairingInput[];
};

export const createTournamentPairingsBulk = async (
  params: CreateTournamentPairingsBulkInput,
): Promise<void> => {
  const { error } = await supabase
    .from('tournament_pairings')
    .insert(params.pairings);
  if (error) {
    throw error;
  }
};

export const useCreateTournamentPairingsBulk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTournamentPairingsBulk,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tournaments_list'] });
      queryClient.invalidateQueries({ queryKey: ['tournament_full', variables.tournamentId] });
    },
    onError: handleError,
  });
};