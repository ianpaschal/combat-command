import { useEffect, useState } from 'react';

import { TournamentTimer } from '~/api';

export const useLocalTournamentTimer = (
  remoteTimer: TournamentTimer | null,
): TournamentTimer | null => {
  // Local copy that the UI will render.
  const [localTimer, setLocalTimer] =
    useState<TournamentTimer | null>(remoteTimer);

  // Always mirror the latest state coming from the backend.
  useEffect(() => {
    setLocalTimer(remoteTimer);
  }, [remoteTimer]);

  // Tick the timer once per second while it is running.
  useEffect(() => {
    if (!remoteTimer) {
      return;
    }
    if (remoteTimer.pausedAt !== null) {
      return;
    }
    if (remoteTimer.remaining <= 0) {
      return;
    }

    const id = setInterval(() => {
      setLocalTimer((prev) => {
        if (!prev) {
          return prev;
        }

        // Do not "tick" if paused:
        if (prev.pausedAt !== null) {
          return prev;
        }

        // Update the values we care about:
        const elapsed = prev.elapsed + 1000;
        const remaining = Math.max(prev.remaining - 1000, 0);

        // Stop ticking when the countdown reaches zero.
        if (remaining === 0) {
          clearInterval(id);
        }

        return { ...prev, remaining, elapsed };
      });
    }, 1000);

    return () => clearInterval(id);
  }, [remoteTimer, remoteTimer?.pausedAt, remoteTimer?.remaining]);

  return localTimer;
};
