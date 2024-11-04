import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { supabase } from '~/supabaseClient';
import { MatchResultInsert } from '~/types/db';

export const addMatchResult = async (result: MatchResultInsert): Promise<void> => {
  const { error } = await supabase
    .from('match_results')
    .insert(result);
  if (error) {
    throw error;
  }
};

export const useAddMatchResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addMatchResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match_result_list'] });
      toast.success('Match result saved!');
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
    },
  });
};