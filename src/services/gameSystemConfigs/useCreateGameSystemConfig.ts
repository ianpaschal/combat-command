import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
import { handleError } from '~/services/handleError';
import { supabase } from '~/supabaseClient';
import { GameSystemConfigRow } from '~/types/db';

/**
 * Input to create a new game system config.
 */
export type CreateGameSystemConfigInput = Omit<GameSystemConfigRow, 'id' | 'created_at' | 'updated_at'>;

/**
 * Query hook to create a game system config.
 * 
 * @returns 
 */
export const useCreateGameSystemConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateGameSystemConfigInput): Promise<void> => {
      const { error } = await supabase.from('game_system_configs').insert(data);
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game_system_configs', 'list'] });
      toast.success('Game system config saved!');
    },
    onError: handleError,
  });
};