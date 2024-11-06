import { ReactNode } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import {
  ArrowRightToLine,
  Clock,
  Pause,
  Timer,
  Undo2,
} from 'lucide-react';

import { Button } from '~/components/generic/Button';
import { Card } from '~/components/generic/Card';
import { useTournamentTimer } from '~/hooks/useTournamentTimer';

import styles from './TournamentRoundTimer.module.scss';

export interface TournamentRoundTimerProps {
  className?: string;
  tournamentId: string;
  roundIndex: number;
}

export const TournamentRoundTimer = ({
  className,
  tournamentId,
  roundIndex,
}: TournamentRoundTimerProps) => {
  const timer = useTournamentTimer(tournamentId, roundIndex);

  const renderTimeRemaining = (): ReactNode[] => format(
    ((timer?.timeRemaining || 0) * 1000), 'h:mm:ss',
  ).split('').map((character) => {
    const className = character === ':' ? styles.TimeRemainingSeparator : styles.TimeRemainingDigit;
    return <span className={className}>{character}</span>;
  });

  return (
    <Card className={clsx(styles.Root, className)} disablePadding>
      <div className={styles.TimerSection}>
        <div className={styles.RoundNumber}>
          <h3>{`Round ${roundIndex + 1}`}</h3>
        </div>
        <div className={styles.TimeRemainingSection}>
          <Timer />
          <div className={styles.TimeRemaining}>
            {renderTimeRemaining()}
          </div>
        </div>
        <div className={styles.EndsAt}>
          <Clock />{timer?.endsAt ? format(timer.endsAt, 'H:mm a') : '...'}
        </div>
      </div>
      <div className={styles.Toolbar}>
        <div className={styles.Controls}>
          <Button variant="ghost" size="small">
            <Undo2 />
          </Button>
          <Button variant="ghost" size="small">
            <Pause />
          </Button>
          <Button variant="ghost" size="small">
            <ArrowRightToLine />
          </Button>
        </div>
        <div className={styles.MatchResultsMonitor}>
          Matches Submitted: 30 / 60
        </div>
      </div>
    </Card>
  );
};