import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CircleAlert } from 'lucide-react';
import { toast } from 'sonner';

import { supabase } from '~/supabaseClient';
import { TournamentPairingInput } from '~/types/db';

export type CreateTournamentPairingsInput = {
  tournamentId: string;
  pairings: TournamentPairingInput[];
};

export const createTournamentPairings = async ({
  pairings,
}: CreateTournamentPairingsInput): Promise<void> => {
  const { error } = await supabase
    .from('tournament_pairings')
    .insert(pairings);
  if (error) {
    throw error;
  }
};

export const useCreateTournamentPairings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTournamentPairings,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tournaments_list'] });
      queryClient.invalidateQueries({ queryKey: ['tournament_full', variables.tournamentId] });
    },
    onError: (error) => {
      toast.error('Error creating tournament pairings', {
        description: error.message,
        icon: <CircleAlert />,
      });
    },
  });
};