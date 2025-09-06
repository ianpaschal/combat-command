import { getBattlePlanDisplayName } from '@ianpaschal/combat-command-static-data/flamesOfWarV4';
import clsx from 'clsx';

import { FowV4MatchResultDetails as FowV4MatchResultDetailData } from '~/api';
import { useElementSize } from '~/hooks/useElementSize';
import { PerPlayerRow } from './components/PerPlayerRow';
import { SingleRow } from './components/SingleRow';
import { formatOutcome } from './FowV4MatchResultDetails.utils';

import styles from './FowV4MatchResultDetails.module.scss';

export interface FowV4MatchResultDetailsProps {
  className?: string;
  details?: FowV4MatchResultDetailData;
  playerNames: [string, string];
  score: [number, number];
}

export const FowV4MatchResultDetails = ({
  className,
  details,
  playerNames,
  score,
}: FowV4MatchResultDetailsProps): JSX.Element | null => {
  const [ref, width] = useElementSize();
  const orientation = Math.ceil(width) < 640 ? 'vertical' : 'horizontal'; // 2 x 320 + 1rem - 2x border
  if (!details) {
    return (
      <div className={clsx(className)}>
        <p>
          Tournament match result details are hidden until the tournament is finished.
        </p>
      </div>
    );
  }
  return (
    <div className={clsx(styles.FowV4MatchResultDetails, className)} ref={ref} data-orientation={orientation}>
      <div className={styles.FowV4MatchResultDetails_Column}>
        <div className={styles.FowV4MatchResultDetails_Section}>
          <h3>Set-Up</h3>
          <PerPlayerRow label="Battle Plans" playerNames={playerNames} values={[
            getBattlePlanDisplayName(details.player0BattlePlan) ?? 'Unknown',
            getBattlePlanDisplayName(details.player1BattlePlan) ?? 'Unknown',
          ]} />
          <SingleRow label="Mission" value={details.missionName ?? 'Unknown'} />
          <SingleRow label="Attacker" value={playerNames[details.attacker]} />
          <SingleRow label="First Turn" value={details.firstTurn} />
        </div>
      </div>
      <div className={styles.FowV4MatchResultDetails_Column}>
        <div className={styles.FowV4MatchResultDetails_Section}>
          <h3>Outcome</h3>
          <SingleRow label="Turns Played" value={details.turnsPlayed} />
          <PerPlayerRow label="Units Lost" playerNames={playerNames} values={[
            details.player0UnitsLost,
            details.player1UnitsLost,
          ]} />
          <SingleRow label="Outcome" value={formatOutcome(details, playerNames)} />
          <PerPlayerRow label="Score" playerNames={playerNames} values={score} />
        </div>
      </div>
    </div>
  );
};
