import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
import { handleError } from '~/services/handleError';
import { CreateMatchResultInput } from '~/services/matchResults/useCreateMatchResult';
import { supabase } from '~/supabaseClient';

/**
 * Query hook to create a match result.
 * 
 * @returns 
 */
export const useCreateGameSystemConfig = () => {
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