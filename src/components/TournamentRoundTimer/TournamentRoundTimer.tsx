import { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { useTournament } from '~/components/TournamentProvider';
import { formatDuration, formatEndTime } from '~/components/TournamentRoundTimer/TournamentRoundTimer.utils';
import {
  useGetTournamentTimer,
  usePauseTournamentTimer,
  useStartTournamentTimer,
} from '~/services/tournamentTimers';

import styles from './TournamentRoundTimer.module.scss';

const phaseLabels = {
  setUp: 'Set-Up',
  pairing: 'Pairing',
  playing: 'Playing',
};

export interface TournamentRoundTimerProps {
  className?: string;
}

export const TournamentRoundTimer = ({
  className,
}: TournamentRoundTimerProps): JSX.Element => {
  const user = useAuth();
  const { _id: tournamentId, currentRound, organizerUserIds } = useTournament();
  const { data: timer } = useGetTournamentTimer({ tournamentId });

  const { mutation: startTimer } = useStartTournamentTimer({ successMessage: 'Timer started!' });
  const { mutation: pauseTimer } = usePauseTournamentTimer({ successMessage: 'Timer paused!' });

  const [localRemaining, setLocalRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (timer?.remaining != null) {
      setLocalRemaining(timer.remaining);
    }
  }, [timer?.remaining, timer?.pausedAt, timer?.startedAt]);

  useEffect(() => {
    if (!localRemaining || timer?.pausedAt) return;

    const interval = setInterval(() => {
      setLocalRemaining(prev => {
        if (prev == null) return null;
        return Math.max(prev - 1000, 0); // count down each second
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [localRemaining, timer?.pausedAt]);

  if (!timer) {
    return <>Loading...</>;
  }

  const handleClickPlayButton = () => {
    if (!timer.startedAt || timer.pausedAt) {
      startTimer({ tournamentId });
    } else {
      pauseTimer({ tournamentId });
    }
  };

  const getRoundLabel = (): string => {
    const base = `Round ${(currentRound ?? 0) + 1}`;
    if (timer.currentPhase) {
      return `${base}: ${phaseLabels[timer.currentPhase]}`;
    }
    return base;
  };

  const remainingTime = formatDuration(localRemaining ?? timer.remaining);
  const endTime = formatEndTime(timer);
  const showControls = user && organizerUserIds.includes(user._id);

  return (
    <div className={clsx(styles.TournamentRoundTimer, className)}>
      <div className={styles.TournamentRoundTimer_TimeSection}>
        <span className={styles.TournamentRoundTimer_Round}>{getRoundLabel()}</span>
        <span className={styles.TournamentRoundTimer_TimeRemaining} data-paused={!!timer.pausedAt}>
          {remainingTime}
        </span>
        {endTime && (
          <span className={styles.TournamentRoundTimer_EndTime}>Ends at {endTime}</span>
        )}
      </div>
      {showControls && (
        <div className={styles.TournamentRoundTimer_Controls}>
          <Button variant="ghost" size="small">
            <SkipBack />
          </Button>
          <Button variant="ghost" size="small" onClick={handleClickPlayButton}>
            {timer.pausedAt ? <Play /> : <Pause />}
          </Button>
          <Button variant="ghost" size="small">
            <SkipForward />
          </Button>
        </div>
      )}
    </div>
  );
};
