import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
import { getCreateHandler } from '~/services/factory/getCreateHandler';
import { handleError } from '~/services/handleError';
import { PlayerRow } from '~/types/db';

/**
 * Input to create a player.
 */
export type CreatePlayerInput = Omit<PlayerRow, 'id' | 'created_at' | 'updated_at'>;

/**
 * Inserts one or several players in the database.
 * 
 * @param input - The player(s) to insert.
 * @returns - The newly created player(s).
 */
export const createPlayer = getCreateHandler<CreatePlayerInput, PlayerRow>('players');

/**
 * Mutation hook to create one or several players.
 */
export const useCreatePlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players', 'list'] });
      toast.success('Player created!');
    },
    onError: handleError,
  });
};
