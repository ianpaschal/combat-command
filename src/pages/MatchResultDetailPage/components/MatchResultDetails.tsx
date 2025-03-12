import { match } from 'assert';
import clsx from 'clsx';

import { FetchMatchResultListResponseItem } from '~/api';
import { useElementSize } from '~/hooks/useElementSize';
import { formatOutcome } from '~/pages/MatchResultDetailPage/components/MatchResultDetails.utils';
import { fowV4BattlePlanOptions } from '~/types/fowV4/fowV4BattlePlanSchema';
import { fowV4OutcomeTypeOptions } from '~/types/fowV4/fowV4MatchOutcomeTypeSchema';

import styles from './MatchResultDetails.module.scss';

export interface MatchResultDetailsProps {
  className?: string;
  matchResult: FetchMatchResultListResponseItem;
}

export const MatchResultDetails = ({
  className,
  matchResult,
}: MatchResultDetailsProps): JSX.Element => {
  const [ref, width] = useElementSize();
  const orientation = Math.ceil(width) < 640 ? 'vertical' : 'horizontal'; // 2 x 320 + 1rem - 2x border

  const playerNames: [string, string] = [
    matchResult.player0User?.givenName || matchResult.player0User?.username || matchResult.player0Placeholder || 'Unknown Player',
    matchResult.player1User?.givenName || matchResult.player1User?.username || matchResult.player1Placeholder || 'Unknown Player',
  ];

  return (
    <div className={clsx(styles.Root, className)} ref={ref} data-orientation={orientation}>
      <div className={styles.MetaSection}>
        <h3>Meta</h3>
        <div>
          <span className={styles.DetailLabel}>Ruleset:</span>
          <span className={styles.DetailValue}>{matchResult.gameSystem} (More Info)</span>
        </div>
        <div>
          <span className={styles.DetailLabel}>Points:</span>
          <span className={styles.DetailValue}>{matchResult.gameSystemConfig.points}</span>
        </div>
        <div>
          <span className={styles.DetailLabel}>Era:</span>
          <span className={styles.DetailValue}>{matchResult.gameSystemConfig.era}</span>
        </div>
      </div>
      <div className={styles.SetUpSection}>
        <h3>Game Set-Up</h3>
        <span className={styles.DetailLabel}>{`${playerNames[0]}\u{2019}s Battle Plan:`}</span>
        <span className={styles.DetailValue}>{fowV4BattlePlanOptions.find((option) => option.value === matchResult.details.player0BattlePlan)?.label}</span>
        <span className={styles.DetailLabel}>{`${playerNames[1]}\u{2019}s Battle Plan:`}</span>
        <span className={styles.DetailValue}>{fowV4BattlePlanOptions.find((option) => option.value === matchResult.details.player1BattlePlan)?.label}</span>
        <span className={styles.DetailLabel}>Mission:</span>
        <span className={styles.DetailValue}>{matchResult.details.missionName}</span>
        <span className={styles.DetailLabel}>Attacker:</span>
        <span className={styles.DetailValue}>{playerNames[matchResult.details.attacker]}</span>
        <span className={styles.DetailLabel}>First Turn:</span>
        <span className={styles.DetailValue}>{playerNames[matchResult.details.firstTurn]}</span>
      </div>
      <div className={styles.OutcomeSection}>
        <h3>Outcome</h3>
        <span className={styles.DetailLabel}>Turns Played:</span>
        <span className={styles.DetailValue}>{matchResult.details.turnsPlayed}</span>
        <span className={styles.DetailLabel}>{`${playerNames[0]}\u{2019}s Units Lost:`}</span>
        <span className={styles.DetailValue}>{matchResult.details.player0UnitsLost}</span>
        <span className={styles.DetailLabel}>{`${playerNames[1]}\u{2019}s Units Lost:`}</span>
        <span className={styles.DetailValue}>{matchResult.details.player1UnitsLost}</span>
        <span className={styles.DetailLabel}>Outcome:</span>
        <span className={styles.DetailValue}>{formatOutcome(matchResult.details, playerNames)}</span>
      </div>
    </div>
  );
};
