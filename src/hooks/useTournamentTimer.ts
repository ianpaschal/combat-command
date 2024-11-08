import { useEffect, useState } from 'react';
import { addSeconds, differenceInSeconds } from 'date-fns';

import { useGetTournamentTimer } from '~/services/tournament_timers/getTournamentTimer';
import { useUpdateTournamentTimer } from '~/services/tournament_timers/updateTournamentTimer';
import { supabase } from '~/supabaseClient';
import { TournamentTimerRow } from '~/types/db';

export interface UseTournamentTimerResult {
  isPaused: boolean;
  timeRemaining: number;
  endsAt: Date | null;
  toggle: () => void;
}

export const useTournamentTimer = (
  tournamentId?: string,
  roundIndex?: number | null,
): UseTournamentTimerResult | undefined => {
  // TODO: pick null or undefined
  const { data: initialTimer } = useGetTournamentTimer(tournamentId && roundIndex !== undefined && roundIndex !== null ? { tournamentId, roundIndex } : undefined);
  const [timer, setTimer] = useState<TournamentTimerRow | undefined>();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [endsAt, setEndsAt] = useState<Date | null>(null);
  const updateTimer = useUpdateTournamentTimer();

  // const calculateTimerValues = () => {
  //   if (timer) {
  //     const elapsedTotalTime = differenceInSeconds(new Date(), new Date(timer.started_at));
  //     const elapsedRunningTime = elapsedTotalTime - timer.stoppage_time;
  //     const newTimeRemaining = Math.max(timer.duration - elapsedRunningTime, 0);
  //     setTimeRemaining(newTimeRemaining);
  //     setEndsAt(addSeconds(new Date(), newTimeRemaining));
  //   }
  // };

  // const updateTimerValues = () => {
  //   if (timer && !timer.paused_at) {
  //     calculateTimerValues();
  //   }
  // };

  useEffect(()=> {
    if (initialTimer) {
      setTimer(initialTimer);
    }
  }, [initialTimer, setTimer]);

  useEffect(() => {
    if (!timer) {
      return;
    }
    const updateRemainingTime = () => {
      const elapsedTotalTime = differenceInSeconds(new Date(), new Date(timer.started_at));
      const elapsedRunningTime = elapsedTotalTime - timer.stoppage_time;
      const newTimeRemaining = Math.max(timer.duration - elapsedRunningTime, 0);
      setTimeRemaining(newTimeRemaining);
      setEndsAt(addSeconds(new Date(), newTimeRemaining));
    };
    updateRemainingTime();
    const interval = setInterval(() => {
      if (!timer.paused_at) {
        updateRemainingTime();
      }
    }, 1000);
    return () => clearInterval(interval); // Clean up on unmount
  }, [timer]);

  supabase
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'tournament_timers',
        // filter: `tournament_id=eq.${tournamentId},round_index=eq.${roundIndex}`,
      },
      (payload) => {
        // console.log('DETECTED CHANGE IN TIMER');
        // console.log(payload);
        setTimer(payload.new as TournamentTimerRow);
      },
    )
    .subscribe();
  
  if (!timer) {
    return undefined;
  }

  const isPaused = !!timer.paused_at;
  const toggle = (): void => {
    if (isPaused) {
      updateTimer.mutate({ timer, action: 'resume' });
    } else {
      updateTimer.mutate({ timer, action: 'pause' });
    }
  };

  return {
    isPaused,
    timeRemaining,
    endsAt,
    toggle,
  };
};