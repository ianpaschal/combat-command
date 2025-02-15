import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
import { getUpdateHandler } from '~/services/factory/getUpdateHandler';
import { handleError } from '~/services/handleError';
import { TournamentPairingRow } from '~/types/db';

/**
 * Input to update a tournament pairing.
 */
export type UpdateTournamentPairingInput = Omit<TournamentPairingRow, 'created_at' | 'updated_at'>;

/**
 * Updates a tournament pairing in the database.
 * 
 * @param input - The updated tournament pairing.
 * @returns - The ID of the updated tournament pairing.
 */
export const updateTournamentPairing = getUpdateHandler<UpdateTournamentPairingInput>('tournament_pairings');

/**
 * Mutation hook to update a tournament pairing.
 */
export const useUpdateTournamentPairing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTournamentPairing,
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['tournament_pairings', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['tournament_pairings', 'single', id] });
      toast.success('Tournament pairing updated!');
    },
    onError: handleError,
  });
};
