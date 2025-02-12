import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
import { handleError } from '~/services/handleError';
import { supabase } from '~/supabaseClient';
import { MatchResult } from '~/types/db';

/**
 * Input to update a match result
 */
export type UpdateMatchResultInput = Omit<MatchResult, 'created_at' | 'updated_at'>;

/**
 * Query hook to update a match result.
 * 
 * @returns 
 */
export const useUpdateMatchResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateMatchResultInput): Promise<void> => {
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