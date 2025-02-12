import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
import { handleError } from '~/services/handleError';
import { supabase } from '~/supabaseClient';
import { PlayerRow } from '~/types/db';

/**
 * Input to create a new tournament player.
 */
export type CreatePlayerInput = Omit<PlayerRow, 'id' | 'created_at' | 'updated_at'>;

/**
 * Query hook to create a player.
 */
export const useCreatePlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePlayerInput): Promise<void> => {
      const { error } = await supabase.from('players').insert(data);
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players', 'list'] });
      toast.success('Player saved!');
    },
    onError: handleError,
  });
};