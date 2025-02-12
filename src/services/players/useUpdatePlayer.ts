import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
import { handleError } from '~/services/handleError';
import { supabase } from '~/supabaseClient';
import { PlayerRow } from '~/types/db';

/**
 * Input to update a player.
 */
export type UpdatePlayerInput = Omit<PlayerRow, 'created_at' | 'updated_at'>;

/**
 * Query hook to update a player.
 */
export const useUpdatePlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdatePlayerInput): Promise<void> => {
      const { error } = await supabase.from('match_results').update(data).eq('id', id);
      if (error) {
        throw error;
      }
    },
    onSuccess: (_data, args) => {
      queryClient.invalidateQueries({ queryKey: ['match_results', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['match_results', 'single', args.id] });
      toast.success('Match result updated!');
    },
    onError: handleError,
  });
};