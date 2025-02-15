import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
import { getUpdateHandler } from '~/services/factory/getUpdateHandler';
import { handleError } from '~/services/handleError';
import { TournamentRow } from '~/types/db';

/**
 * Input to update a tournament.
 */
export type UpdateTournamentInput = Omit<TournamentRow, 'created_at' | 'updated_at'>;

/**
 * Updates a tournament in the database.
 * 
 * @param input - The updated tournament.
 * @returns - The ID of the updated tournament.
 */
export const updateTournament = getUpdateHandler<UpdateTournamentInput>('tournaments');

/**
 * Mutation hook to update a tournament.
 */
export const useUpdateTournament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTournament,
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['tournaments', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['tournaments', 'single', id] });
      toast.success('Tournament updated!');
    },
    onError: handleError,
  });
};
