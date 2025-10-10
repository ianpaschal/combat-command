import { forwardRef } from 'react';
import {
  calculateMatchResultScore,
  getBattlePlanDisplayName,
  getMissionDisplayName,
  MatchResultDetails as Details,
} from '@ianpaschal/combat-command-game-systems/teamYankeeV2';
import clsx from 'clsx';

import { Separator } from '~/components/generic/Separator';
import { MatchResultDetailRow } from '../../components/MatchResultDetailRow';
import { formatOutcome } from './TeamYankeeV2MatchResultDetails.utils';

import styles from './TeamYankeeV2MatchResultDetails.module.scss';

export interface TeamYankeeV2MatchResultDetailsProps {
  className?: string;
  details: Details;
  playerNames: [string, string];
  orientation: 'horizontal' | 'vertical';
}

export const TeamYankeeV2MatchResultDetails = forwardRef<HTMLDivElement, TeamYankeeV2MatchResultDetailsProps>(({
  className,
  details,
  playerNames,
  orientation = 'horizontal',
}, ref) => (
  <div className={clsx(styles.TeamYankeeV2MatchResultDetails, className)} ref={ref} data-orientation={orientation}>
    <div className={styles.TeamYankeeV2MatchResultDetails_Section}>
      <h3>Set-Up</h3>
      <MatchResultDetailRow label="Battle Plans" playerNames={playerNames} values={[
        getBattlePlanDisplayName(details.player0BattlePlan) ?? 'Unknown',
        getBattlePlanDisplayName(details.player1BattlePlan) ?? 'Unknown',
      ]} />
      <MatchResultDetailRow label="Mission" values={[getMissionDisplayName(details.mission) ?? 'Unknown']} />
      <MatchResultDetailRow label="Attacker" values={[playerNames[details.attacker]]} />
      <MatchResultDetailRow label="First Turn" values={[playerNames[details.firstTurn]]} />
    </div>
    <Separator orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'} />
    <div className={styles.TeamYankeeV2MatchResultDetails_Section}>
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
));
