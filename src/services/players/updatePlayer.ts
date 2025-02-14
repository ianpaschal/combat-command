import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
import { getUpdater } from '~/services/factory/getUpdater';
import { handleError } from '~/services/handleError';
import { PlayerRow } from '~/types/db';

/**
 * Input to update a player.
 */
export type UpdatePlayerInput = Omit<PlayerRow, 'created_at' | 'updated_at'>;

/**
 * Updates a player in the database.
 * 
 * @param input - The updated player.
 * @returns - The ID of the updated player.
 */
export const updatePlayer = getUpdater<UpdatePlayerInput>('players');

/**
 * Mutation hook to update a player.
 */
export const useUpdatePlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePlayer,
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['players', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['players', 'single', id] });
      toast.success('Player updated!');
    },
    onError: handleError,
  });
};