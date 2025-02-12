import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
import { handleError } from '~/services/handleError';
import { supabase } from '~/supabaseClient';
import { MatchResultRow } from '~/types/db';

/**
 * Input to create a new tournament match result.
 */
export type UpdateMatchResultInput = Omit<MatchResultRow, 'id' | 'created_at' | 'updated_at'>;

/**
 * Query hook to create a single match result.
 * 
 * This is kept separate from the hook to create a tournament match result because the latter
 * doesn't require the creation of new player and game system config objects.
 */
export const useCreateSingleMatchResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateMatchResultInput): Promise<void> => {
      const { error } = await supabase.from('match_results').insert(data);
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match_results', 'list'] });
      toast.success('Match result saved!');
    },
    onError: handleError,
  });
};