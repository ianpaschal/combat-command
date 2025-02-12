import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
import { handleError } from '~/services/handleError';
import { supabase } from '~/supabaseClient';
import { MatchResult } from '~/types/db';

/**
 * Input to create a new match result
 */
export type CreateMatchResultInput = Omit<MatchResult, 'id' | 'created_at' | 'updated_at'>;

/**
 * Query hook to create a match result.
 * 
 * @returns 
 */
export const useCreateMatchResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateMatchResultInput): Promise<void> => {
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