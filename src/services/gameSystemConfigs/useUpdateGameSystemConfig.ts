import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
import { getUpdater } from '~/services/factory/getUpdater';
import { handleError } from '~/services/handleError';
import { GameSystemConfigRow } from '~/types/db';

/**
 * Input to update a game system config.
 */
export type UpdateGameSystemConfigInput = Omit<GameSystemConfigRow, 'created_at' | 'updated_at'>;

/**
 * Updates a game system config in the database.
 * 
 * @param input - The updated game system config.
 * @returns - The ID of the updated game system config.
 */
export const updateGameSystemConfig = getUpdater<UpdateGameSystemConfigInput>('game_system_configs');

/**
 * Mutation hook to update a game system config.
 */
export const useUpdateGameSystemConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGameSystemConfig,
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['game_system_configs', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['game_system_configs', 'single', id] });
      toast.success('Game system config updated!');
    },
    onError: handleError,
  });
};