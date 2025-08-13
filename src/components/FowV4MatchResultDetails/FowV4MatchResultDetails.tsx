import { getBattlePlanDisplayName, getMissionDisplayName } from '@ianpaschal/combat-command-static-data/flamesOfWarV4';
import clsx from 'clsx';

import { useElementSize } from '~/hooks/useElementSize';
import { useGetUser } from '~/services/users';
import { calculateMatchScore } from '~/utils/flamesOfWarV4Utils/calculateMatchScore';
import { PerPlayerRow } from './components/PerPlayerRow';
import { SingleRow } from './components/SingleRow';
import { FowV4MatchResultDetailsData } from './FowV4MatchResultDetails.types';
import { formatOutcome } from './FowV4MatchResultDetails.utils';

import styles from './FowV4MatchResultDetails.module.scss';

export interface FowV4MatchResultDetailsProps {
  className?: string;
  matchResult?: FowV4MatchResultDetailsData;
}

export const FowV4MatchResultDetails = ({
  className,
  matchResult,
}: FowV4MatchResultDetailsProps): JSX.Element | null => {
  const [ref, width] = useElementSize();
  const orientation = Math.ceil(width) < 640 ? 'vertical' : 'horizontal'; // 2 x 320 + 1rem - 2x border

  const {
    data: player0User,
    loading: player0UserLoading,
  } = useGetUser(!matchResult?.player0User && matchResult?.player0UserId ? {
    id: matchResult?.player0UserId,
  } : 'skip');
  const {
    data: player1User,
    loading: player1UserLoading,
  } = useGetUser(!matchResult?.player1User && matchResult?.player1UserId ? {
    id: matchResult?.player1UserId,
  } : 'skip');

  if (!matchResult) {
    return null;
  }

  const playerNames: [string, string] = [
    matchResult?.player0User?.displayName ?? player0User?.displayName ?? 'Ghost',
    matchResult?.player1User?.displayName ?? player1User?.displayName ?? 'Ghost',
  ];
  const battlePlans: [string, string] = [
    getBattlePlanDisplayName(matchResult.details.player0BattlePlan) ?? 'Hidden',
    getBattlePlanDisplayName(matchResult.details.player1BattlePlan) ?? 'Hidden',
  ];
  const unitsLost: [number, number] = [
    matchResult.details.player0UnitsLost,
    matchResult.details.player1UnitsLost,
  ];
  const score = calculateMatchScore(matchResult.details);
  const missionName = getMissionDisplayName(matchResult.details.mission) ?? 'Hidden';

  if (player0UserLoading || player1UserLoading) {
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
