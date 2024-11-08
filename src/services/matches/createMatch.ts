import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { supabase } from '~/supabaseClient';
import { MatchInput } from '~/types/db/Matches';

export type CreateMatchInput = {
  tournamentId: string;
  match: MatchInput;
};

export const createMatch = async ({
  match,
}: CreateMatchInput): Promise<void> => {
  const { error } = await supabase
    .from('match_results')
    .insert(match);
  if (error) {
    throw error;
  }
};

export const useCreateMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMatch,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['match_result_list'] });
      queryClient.invalidateQueries({ queryKey: ['tournament_full', variables.tournamentId] });
      toast.success('Match result saved!');
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
    },
  });
};