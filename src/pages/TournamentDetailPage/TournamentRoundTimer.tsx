import clsx from 'clsx';
import {
  ArrowRightToLine,
  Clock,
  Pause,
  Timer,
  Undo2,
} from 'lucide-react';

import { Button } from '~/components/generic/Button';
import { Card } from '~/components/generic/Card';

import styles from './TournamentRoundTimer.module.scss';

export interface TournamentRoundTimerProps {
  className?: string;
}

export const TournamentRoundTimer = ({
  className,
}: TournamentRoundTimerProps) => (
  <Card className={clsx(styles.Root, className)} disablePadding>
    <div className={styles.TimerSection}>
      <div className={styles.RoundNumber}>
        <h3>Round 3</h3>
      </div>
      <div className={styles.TimeRemaining}>
        <Timer />0:00:00
      </div>
      <div className={styles.EndsAt}>
        <Clock /> 00:00
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