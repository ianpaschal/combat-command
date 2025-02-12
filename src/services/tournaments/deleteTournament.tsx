import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from '~/services/handleError';
import { supabase } from '~/supabaseClient';
import { TournamentRow } from '~/types/db';

export type DeleteTournamentInput = Partial<TournamentRow> & { id: string };

export const deleteTournament = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('tournaments')
    .delete()
    .eq('id', id);
  if (error) {
    throw error;
  }
};

/**
 * Custom hook to create a deleteTournament function.
 * 
 * @returns - A function which deletes a tournament by ID
 */
export const useDeleteTournament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTournament,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments_list'] });
    },
    onError: handleError,
  });
};