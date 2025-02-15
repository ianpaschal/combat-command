import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
import { getDeleteHandler } from '~/services/factory/getDeleteHandler';
import { handleError } from '~/services/handleError';

/**
 * Deletes a tournament in the database.
 * 
 * @param input - The ID of the tournament to delete.
 * @returns - The ID of the deleted tournament.
 */
export const deleteTournament = getDeleteHandler('tournaments');

/**
 * Mutation hook to delete a tournament.
 */
export const useDeleteTournament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTournament,
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['tournaments', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['tournaments', 'single', id] });
      toast.success('Tournament deleted!');
    },
    onError: handleError,
  });
};
