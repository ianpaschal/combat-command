import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
import { getDeleteHandler } from '~/services/factory/getDeleteHandler';
import { handleError } from '~/services/handleError';

/**
 * Deletes a game system config in the database.
 * 
 * @param input - The ID of the game system config to delete.
 * @returns - The ID of the deleted game system config.
 */
export const deleteGameSystemConfig = getDeleteHandler('game_system_configs');

/**
 * Mutation hook to delete a game system config.
 */
export const useDeleteGameSystemConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGameSystemConfig,
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['game_system_configs', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['game_system_configs', 'single', id] });
      toast.success('Game system config deleted!');
    },
    onError: handleError,
  });
};
