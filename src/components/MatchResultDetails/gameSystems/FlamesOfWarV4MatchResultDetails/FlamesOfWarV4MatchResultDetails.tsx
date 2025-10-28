import { forwardRef } from 'react';
import {
  calculateMatchResultScore,
  getBattlePlanDisplayName,
  getMissionDisplayName,
  MatchResultDetails as Details,
} from '@ianpaschal/combat-command-game-systems/flamesOfWarV4';
import clsx from 'clsx';

import { MatchResultDetailRow } from '../../components/MatchResultDetailRow';
import { formatOutcome } from './FlamesOfWarV4MatchResultDetails.utils';

import styles from './FlamesOfWarV4MatchResultDetails.module.scss';

export interface FlamesOfWarV4MatchResultDetailsProps {
  className?: string;
  details: Details;
  playerNames: [string, string];
  orientation: 'horizontal' | 'vertical';
}

export const FlamesOfWarV4MatchResultDetails = forwardRef<HTMLDivElement, FlamesOfWarV4MatchResultDetailsProps>(({
  className,
  details,
  playerNames,
  orientation = 'horizontal',
}, ref) => (
  <div className={clsx(styles.FlamesOfWarV4MatchResultDetails, className)} ref={ref} data-orientation={orientation}>
    <div className={styles.FlamesOfWarV4MatchResultDetails_Column}>
      <div className={styles.FlamesOfWarV4MatchResultDetails_Section}>
        <h3>Set-Up</h3>
        <MatchResultDetailRow label="Battle Plans" playerNames={playerNames} values={[
          getBattlePlanDisplayName(details.player0BattlePlan) ?? 'Unknown',
          getBattlePlanDisplayName(details.player1BattlePlan) ?? 'Unknown',
        ]} />
        <MatchResultDetailRow label="Mission" values={[getMissionDisplayName(details.mission) ?? 'Unknown']} />
        <MatchResultDetailRow label="Attacker" values={[playerNames[details.attacker]]} />
        <MatchResultDetailRow label="First Turn" values={[playerNames[details.firstTurn]]} />
      </div>
    </div>
    <div className={styles.FlamesOfWarV4MatchResultDetails_Column}>
      <div className={styles.FlamesOfWarV4MatchResultDetails_Section}>
        <h3>Outcome</h3>
        <MatchResultDetailRow label="Turns Played" values={[details.turnsPlayed]} />
        <MatchResultDetailRow label="Units Lost" playerNames={playerNames} values={[
          details.player0UnitsLost,
          details.player1UnitsLost,
        ]} />
        <MatchResultDetailRow label="Outcome" values={[formatOutcome(details, playerNames)]} />
        <MatchResultDetailRow label="Score" playerNames={playerNames} values={calculateMatchResultScore(details)} />
      </div>
    </div>
  </div>
));
