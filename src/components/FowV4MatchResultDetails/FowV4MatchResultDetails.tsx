import clsx from 'clsx';

import { fowV4BattlePlanOptions, getMission } from '~/api';
import { useElementSize } from '~/hooks/useElementSize';
import { calculateMatchScore } from '~/utils/flamesOfWarV4Utils/calculateMatchScore';
import { PerPlayerRow } from './components/PerPlayerRow';
import { SingleRow } from './components/SingleRow';
import { usePlayerNames } from './FowV4MatchResultDetails.hooks';
import { FowV4MatchResultDetailsData } from './FowV4MatchResultDetails.types';
import { formatOutcome } from './FowV4MatchResultDetails.utils';

import styles from './FowV4MatchResultDetails.module.scss';

export interface FowV4MatchResultDetailsProps {
  className?: string;
  matchResult: FowV4MatchResultDetailsData;
}

export const FowV4MatchResultDetails = ({
  className,
  matchResult,
}: FowV4MatchResultDetailsProps): JSX.Element => {
  const [ref, width] = useElementSize();
  const orientation = Math.ceil(width) < 640 ? 'vertical' : 'horizontal'; // 2 x 320 + 1rem - 2x border

  const playerNames = usePlayerNames(matchResult);
  const score = calculateMatchScore(matchResult.details);
  const missionName = matchResult.details.missionName ?? getMission(matchResult.details.missionId)?.displayName;
  const battlePlans: [string, string] = [
    fowV4BattlePlanOptions.find((option) => option.value === matchResult.details.player0BattlePlan)?.label ?? 'Hidden',
    fowV4BattlePlanOptions.find((option) => option.value === matchResult.details.player1BattlePlan)?.label ?? 'Hidden',
  ];
  const unitsLost: [number, number] = [
    matchResult.details.player0UnitsLost,
    matchResult.details.player1UnitsLost,
  ];
  if (!playerNames) {
    return <span>Loading...</span>;
  }

  return (
    <div className={clsx(styles.FowV4MatchResultDetails, className)} ref={ref} data-orientation={orientation}>
      <div className={styles.FowV4MatchResultDetails_Column}>
        <div className={styles.FowV4MatchResultDetails_Section}>
          <h3>Set-Up</h3>
          <PerPlayerRow label="Battle Plans" playerNames={playerNames} values={battlePlans} />
          <SingleRow label="Mission" value={missionName} />
          <SingleRow label="Attacker" value={playerNames[matchResult.details.attacker]} />
          <SingleRow label="First Turn" value={playerNames[matchResult.details.firstTurn]} />
        </div>
      </div>
      <div className={styles.FowV4MatchResultDetails_Column}>
        <div className={styles.FowV4MatchResultDetails_Section}>
          <h3>Outcome</h3>
          <SingleRow label="Turns Played" value={matchResult.details.turnsPlayed} />
          <PerPlayerRow label="Units Lost" playerNames={playerNames} values={unitsLost} />
          <SingleRow label="Outcome" value={formatOutcome(matchResult.details, playerNames)} />
          <PerPlayerRow label="Score" playerNames={playerNames} values={score} />
        </div>
      </div>
    </div>
  );
};
