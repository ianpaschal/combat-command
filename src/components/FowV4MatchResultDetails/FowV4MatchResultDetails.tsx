import { getBattlePlanDisplayName } from '@ianpaschal/combat-command-static-data/flamesOfWarV4';
import clsx from 'clsx';

import { MatchResultDetails } from '~/api';
import { useElementSize } from '~/hooks/useElementSize';
import { PerPlayerRow } from './components/PerPlayerRow';
import { SingleRow } from './components/SingleRow';
import { formatOutcome } from './FowV4MatchResultDetails.utils';

import styles from './FowV4MatchResultDetails.module.scss';

export interface FowV4MatchResultDetailsProps {
  className?: string;
  details: MatchResultDetails;
  playerNames: [string, string];
}

export const FowV4MatchResultDetails = ({
  className,
  details,
  playerNames,
}: FowV4MatchResultDetailsProps): JSX.Element | null => {
  const [ref, width] = useElementSize();
  const orientation = Math.ceil(width) < 640 ? 'vertical' : 'horizontal'; // 2 x 320 + 1rem - 2x border

  const battlePlans: [string, string] = [
    getBattlePlanDisplayName(details.player0BattlePlan) ?? 'Hidden',
    getBattlePlanDisplayName(details.player1BattlePlan) ?? 'Hidden',
  ];
  const unitsLost: [number, number] = [
    details.player0UnitsLost ?? 0,
    details.player1UnitsLost ?? 0,
  ];
  const score: [number, number] = [details.player0Score, details.player1Score];

  const missionName = details.missionName ?? 'Hidden';
  const attacker = details.attacker !== undefined ? playerNames[details.attacker] : 'Hidden';
  const firstTurn = details.firstTurn !== undefined ? playerNames[details.firstTurn] : 'Hidden';
  const turnsPlayed = details.turnsPlayed ?? 'Hidden';

  return (
    <div className={clsx(styles.FowV4MatchResultDetails, className)} ref={ref} data-orientation={orientation}>
      <div className={styles.FowV4MatchResultDetails_Column}>
        <div className={styles.FowV4MatchResultDetails_Section}>
          <h3>Set-Up</h3>
          <PerPlayerRow label="Battle Plans" playerNames={playerNames} values={battlePlans} />
          <SingleRow label="Mission" value={missionName} />
          <SingleRow label="Attacker" value={attacker} />
          <SingleRow label="First Turn" value={firstTurn} />
        </div>
      </div>
      <div className={styles.FowV4MatchResultDetails_Column}>
        <div className={styles.FowV4MatchResultDetails_Section}>
          <h3>Outcome</h3>
          <SingleRow label="Turns Played" value={turnsPlayed} />
          <PerPlayerRow label="Units Lost" playerNames={playerNames} values={unitsLost} />
          <SingleRow label="Outcome" value={formatOutcome(details, playerNames)} />
          <PerPlayerRow label="Score" playerNames={playerNames} values={score} />
        </div>
      </div>
    </div>
  );
};
