import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
import { getDeleteHandler } from '~/services/factory/getDeleteHandler';
import { handleError } from '~/services/handleError';

/**
 * Deletes a tournament competitor in the database.
 * 
 * @param input - The ID of the tournament competitor to delete.
 * @returns - The ID of the deleted tournament competitor.
 */
export const deleteTournamentCompetitor = getDeleteHandler('tournament_competitors');

/**
 * Mutation hook to delete a tournament competitor.
 */
export const useDeleteTournamentCompetitor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTournamentCompetitor,
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['tournament_competitors', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['tournament_competitors', 'single', id] });
      toast.success('Tournament competitor deleted!');
    },
    onError: handleError,
  });
};
