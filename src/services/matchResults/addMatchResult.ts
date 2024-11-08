import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { supabase } from '~/supabaseClient';
import { MatchResultInsert } from '~/types/db';

export const addMatchResult = async ({
  tournament_id: _tournament_id,
  ...result
}: MatchResultInsert): Promise<void> => {
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
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['match_result_list'] });
      queryClient.invalidateQueries({ queryKey: ['tournament_full', variables.tournament_pairing_id] });
      toast.success('Match result saved!');
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
    },
  });
};