import { useMutation, useQueryClient } from '@tanstack/react-query';
import { differenceInSeconds } from 'date-fns';
import {
  CirclePause,
  CirclePlay,
  CircleSlash,
} from 'lucide-react';

import { toast } from '~/components/ToastProvider';
import { handleError } from '~/services/handleError';
import { supabase } from '~/supabaseClient';
import { TournamentTimerRow } from '~/types/db';

export type UpdateTournamentTimerInput = {
  action: 'pause' | 'resume' | 'reset';
  timer?: TournamentTimerRow;
};

export const updateTournamentTimer = async ({ timer, action }: UpdateTournamentTimerInput): Promise<void> => {
  if (!timer) {
    throw Error('The requested timer does not exist!');
  }

  let data: Partial<TournamentTimerRow> = {};

  if (!timer.paused_at && action === 'pause') {
    data = {
      paused_at: new Date().toISOString(),
    };
  }
  if (!!timer.paused_at && action === 'resume') {
    const lastPauseDuration = differenceInSeconds(new Date(), new Date(timer.paused_at));
    data = {
      paused_at: null,
      stoppage_time: timer.stoppage_time + lastPauseDuration,
    };
  }
  if (action === 'reset') {
    data = {
      started_at: new Date().toISOString(),
      paused_at: null,
      stoppage_time: 0,
    };
  }

  const { error } = await supabase
    .from('tournament_timers')
    .update(data)
    .eq('id', timer.id);
  if (error) {
    throw error;
  }
};

export const useUpdateTournamentTimer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTournamentTimer,
    onSuccess: (_data, variables) => {
      if (variables.action === 'pause') {
        toast.info('Round paused!', { icon: <CirclePause /> });
      }
      if (variables.action === 'resume') {
        toast.info('Round resumed!', { icon: <CirclePlay /> });
      }
      if (variables.action === 'reset') {
        toast.info('Round reset!', { icon: <CircleSlash /> });
      }
      queryClient.invalidateQueries({ queryKey: ['tournament_full', variables.timer?.tournament_id] });
      queryClient.invalidateQueries({ queryKey: ['tournament_timer', { tournamentId: variables.timer?.tournament_id, roundIndex: variables.timer?.round_index }] });
    },
    onError: handleError,
  });
};