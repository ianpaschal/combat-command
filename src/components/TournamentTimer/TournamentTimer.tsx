import { getTournamentRoundPhaseDisplayName } from '@ianpaschal/combat-command-game-systems/common';
import clsx from 'clsx';
import { LoaderCircle } from 'lucide-react';

import { CircularProgress } from '~/components/generic/CircularProgress';
import { useTournament } from '~/components/TournamentProvider';
import { TimerControls } from '~/components/TournamentTimer/components/TimerControls';
import { useGetTournamentTimerByTournament } from '~/services/tournamentTimers';
import { useLocalTournamentTimer } from './TournamentTimer.hooks';
import {
  getCurrentPhase,
  getCurrentPhaseEndTime,
  getCurrentPhaseTimeRemaining,
  getRemainingTimeElements,
} from './TournamentTimer.utils';

import styles from './TournamentTimer.module.scss';

export interface TournamentTimerProps {
  className?: string;
}

export const TournamentTimer = ({
  className,
}: TournamentTimerProps): JSX.Element | null => {
  const { _id: tournamentId, currentRound, roundStructure } = useTournament();
  const { data: remoteTimer } = useGetTournamentTimerByTournament({ tournamentId, round: currentRound ?? 0 });

  const timer = useLocalTournamentTimer(remoteTimer ?? null);

  // if (currentRound === undefined) {
  //   return null;
  // }

  if (!timer) {
    return <div className={clsx(styles.TournamentTimer, className)}>
      <LoaderCircle className={styles.TournamentTimer_LoadingIcon} />
    </div>;
  }

  const currentPhaseRemaining = getCurrentPhaseTimeRemaining(timer.elapsed, roundStructure);
  const currentPhase = getCurrentPhase(timer.elapsed, roundStructure);
  const currentPhaseLabel = getTournamentRoundPhaseDisplayName(currentPhase);
  const currentPhaseEndTime = getCurrentPhaseEndTime(timer, roundStructure);
  const remainingTimeElements = getRemainingTimeElements(currentPhaseRemaining);

  return (
    <div className={clsx(styles.TournamentTimer, className)}>
      <div className={styles.TournamentTimer_TimeSection}>
        <CircularProgress className={styles.TournamentTimer_RoundRing} total={timer.total} filled={timer.elapsed} strokeWidth={8} size={96}>
          <div className={styles.TournamentTimer_RoundInner}>
            <span className={styles.TournamentTimer_RoundNumber}>{(currentRound ?? 0) + 1}</span>
          </div>
        </CircularProgress>
        <div className={clsx(styles.TournamentTimer_TextLine, styles.TournamentTimer_CurrentPhase)}>
          <span className={styles.TournamentTimer_TextLine_Label}>Phase:</span>
          <span className={styles.TournamentTimer_TextLine_Value}>{currentPhaseLabel}</span>
        </div>
        <span className={styles.TournamentTimer_TimeRemaining} data-paused={!!timer.pausedAt}>
          {remainingTimeElements}
        </span>
        <div className={clsx(styles.TournamentTimer_TextLine, styles.TournamentTimer_EndTime)}>
          <span className={styles.TournamentTimer_TextLine_Label}>Ends at:</span>
          <span className={styles.TournamentTimer_TextLine_Value}>{currentPhaseEndTime}</span>
        </div>
      </div>
      <TimerControls timer={timer} />
    </div>
  );
};
