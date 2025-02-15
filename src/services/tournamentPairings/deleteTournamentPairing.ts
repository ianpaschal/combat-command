import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
import { getDeleteHandler } from '~/services/factory/getDeleteHandler';
import { handleError } from '~/services/handleError';

/**
 * Deletes a tournament pairing in the database.
 * 
 * @param input - The ID of the tournament pairing to delete.
 * @returns - The ID of the deleted tournament pairing.
 */
export const deleteTournamentPairing = getDeleteHandler('tournament_pairings');

/**
 * Mutation hook to delete a tournament pairing.
 */
export const useDeleteTournamentPairing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTournamentPairing,
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['tournament_pairings', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['tournament_pairings', 'single', id] });
      toast.success('Tournament pairing deleted!');
    },
    onError: handleError,
  });
};
