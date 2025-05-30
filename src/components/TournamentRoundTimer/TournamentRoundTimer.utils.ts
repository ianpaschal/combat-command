import { format } from 'date-fns';

import { TournamentTimer } from '~/api';

export const formatDuration = (duration: number | null): string => {
  if (duration === null) {
    return '--:--';
  }
  const totalSeconds = Math.floor(duration / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hours) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
};

export const formatEndTime = (timer: TournamentTimer): string | null => {
  const { startedAt, remainingInPhase, pausedAt } = timer;
  if (!startedAt || pausedAt !== null) {
    return null;
  }
  return format(new Date(startedAt + remainingInPhase), 'HH:mm');
};
