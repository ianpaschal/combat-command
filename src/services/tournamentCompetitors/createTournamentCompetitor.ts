import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
import { getCreateHandler } from '~/services/factory/getCreateHandler';
import { handleError } from '~/services/handleError';
import { createPlayer, CreatePlayerInput } from '~/services/players/createPlayer';
import { TournamentCompetitorRow } from '~/types/db';

/**
 * Input to create a tournament competitor.
 */
export type CreateTournamentCompetitorInput = Omit<TournamentCompetitorRow, 'id' | 'created_at' | 'updated_at'> & {
  players?: CreatePlayerInput[];
};

/**
 * Inserts a tournament competitor in the database.
 *
 * @param input - The tournament competitors to insert.
 * @returns - The newly created tournament competitors.
 */
export const createTournamentCompetitor = getCreateHandler<CreateTournamentCompetitorInput, TournamentCompetitorRow>('tournament_competitors');

/**
 * Mutation hook to create a tournament competitor.
 */
export const useCreateTournamentCompetitor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ players, ...data }: CreateTournamentCompetitorInput) => {
      if (players) {
        createPlayer(players);
      }
      return createTournamentCompetitor(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournament_competitors', 'list'] });
      toast.success('Tournament competitor created!');
    },
    onError: handleError,
  });
};
