import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
import { getDeleteHandler } from '~/services/factory/getDeleteHandler';
import { handleError } from '~/services/handleError';

/**
 * Deletes a player in the database.
 * 
 * @param input - The ID of the player to delete.
 * @returns - The ID of the deleted player.
 */
export const deletePlayer = getDeleteHandler('players');

/**
 * Mutation hook to delete a player.
 */
export const useDeletePlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePlayer,
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['players', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['players', 'single', id] });
      toast.success('Player deleted!');
    },
    onError: handleError,
  });
};
