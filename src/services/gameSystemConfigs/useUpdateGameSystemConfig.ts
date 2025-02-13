import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
import { handleError } from '~/services/handleError';
import { supabase } from '~/supabaseClient';
import { GameSystemConfigRow } from '~/types/db';

/**
 * Input to update a game system config.
 */
export type UpdateGameSystemConfigInput = Omit<GameSystemConfigRow, 'created_at' | 'updated_at'>;

/**
 * Query hook to update a game system config.
 */
export const useUpdateGameSystemConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateGameSystemConfigInput): Promise<void> => {
      const { error } = await supabase.from('game_system_configs').update(data).eq('id', id);
      if (error) {
        throw error;
      }
    },
    onSuccess: (_data, args) => {
      queryClient.invalidateQueries({ queryKey: ['game_system_configs', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['game_system_configs', 'single', args.id] });
      toast.success('Game system config updated!');
    },
    onError: handleError,
  });
};