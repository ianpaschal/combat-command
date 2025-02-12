import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleError } from '~/services/handleError';
import { supabase } from '~/supabaseClient';

export type CreateTournamentTimerInput = {
  duration: number;
  round_index: number;
  tournament_id: string;
};

export const createTournamentTimer = async ({
  duration,
  round_index,
  tournament_id,
}: CreateTournamentTimerInput): Promise<void> => {
  const { error } = await supabase
    .from('tournament_timers')
    .insert({
      duration,
      round_index,
      started_at: new Date().toISOString(),
      tournament_id,
    });
  if (error) {
    throw error;
  }
};

export const useCreateTournamentTimer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTournamentTimer,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tournament_full', variables.tournament_id] });
    },
    onError: handleError,
  });
};