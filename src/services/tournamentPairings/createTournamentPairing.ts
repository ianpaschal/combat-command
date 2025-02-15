import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
import { getCreateHandler } from '~/services/factory/getCreateHandler';
import { handleError } from '~/services/handleError';
import { TournamentPairingRow } from '~/types/db';

/**
 * Input to create a tournament pairing.
 */
export type CreateTournamentPairingInput = Omit<TournamentPairingRow, 'id' | 'created_at' | 'updated_at'>;

/**
 * Inserts a tournament pairing in the database.
 *
 * @param input - The tournament pairings to insert.
 * @returns - The newly created tournament pairings.
 */
export const createTournamentPairing = getCreateHandler<CreateTournamentPairingInput, TournamentPairingRow>('tournament_pairings');

/**
 * Mutation hook to create a tournament pairing.
 */
export const useCreateTournamentPairing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTournamentPairing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournament_pairings', 'list'] });
      toast.success('Tournament pairing created!');
    },
    onError: handleError,
  });
};
