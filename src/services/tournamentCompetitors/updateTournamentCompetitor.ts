import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
import { getUpdater } from '~/services/factory/getUpdater';
import { handleError } from '~/services/handleError';
import { TournamentCompetitorRow } from '~/types/db';

/**
 * Input to update a tournament competitor.
 */
export type UpdateTournamentCompetitorInput = Omit<TournamentCompetitorRow, 'created_at' | 'updated_at'>;

/**
 * Updates a tournament competitor in the database.
 * @param input - The updated tournament competitor.
 * @returns - The ID of the updated tournament competitor.
 */
export const updateTournamentCompetitor = getUpdater<UpdateTournamentCompetitorInput>('tournament_competitors');

/**
 * Mutation hook to update a tournament competitor.
 */
export const useUpdateTournamentCompetitor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTournamentCompetitor,
    onSuccess: (_data, args) => {
      queryClient.invalidateQueries({ queryKey: ['tournament_competitors', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['tournament_competitors', 'single', args.id] });
      toast.success('Tournament competitor updated!');
    },
    onError: handleError,
  });
};