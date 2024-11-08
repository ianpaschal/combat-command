import clsx from 'clsx';

import { TournamentPairingDeep } from '~/types/db/TournamentPairings';
import { getCompetitorDisplay } from '~/utils/common/getCompetitorDisplay';

import styles from './PairingCell.module.scss';

interface PairingCellProps {
  data: TournamentPairingDeep;
}

export const PairingCell = ({
  data,
}: PairingCellProps): JSX.Element => {
  const [competitor0Name] = getCompetitorDisplay(data.competitor_0);
  const [competitor1Name] = getCompetitorDisplay(data.competitor_1);
  return (
    <div className={clsx('PairingCell', styles.Root)}>
      {competitor0Name}
      <span className={styles.Separator}>vs.</span>
      {competitor1Name}
    </div>
  );
};