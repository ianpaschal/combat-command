import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
import { getCreator } from '~/services/factory/getCreator';
import { handleError } from '~/services/handleError';
import { GameSystemConfigRow } from '~/types/db';

/**
 * Input to create a game system config.
 */
export type CreateGameSystemConfigInput = Omit<GameSystemConfigRow, 'id' | 'created_at' | 'updated_at'>;

/**
 * Inserts one or several game system configs in the database.
 * 
 * @param input - The game system config(s) to insert.
 * @returns - The newly created game system config(s).
 */
export const createGameSystemConfig = getCreator<CreateGameSystemConfigInput, GameSystemConfigRow>('game_system_configs');

/**
 * Mutation hook to create one or several game system configs.
 */
export const useCreateGameSystemConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGameSystemConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game_system_configs', 'list'] });
      toast.success('Game system config created!');
    },
    onError: handleError,
  });
};