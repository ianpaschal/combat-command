import { useWindowWidth } from '@react-hook/window-size/throttled';
import clsx from 'clsx';

import { TournamentPairing } from '~/api';
import { IdentityBadge } from '~/components/IdentityBadge';
import { MOBILE_BREAKPOINT } from '~/settings';
import { getIdentityBadgeProps } from './TournamentPairingRow.utils';

import styles from './TournamentPairingRow.module.scss';

export type TournamentPairingRowData = Pick<TournamentPairing, 'tournamentCompetitor0' | 'tournamentCompetitor1' | 'table'>;

export interface TournamentPairingRowProps {
  pairing?: TournamentPairingRowData;
  loading?: boolean;
  className?: string;
  disableLink?: boolean;
}

export const TournamentPairingRow = ({
  pairing,
  loading = false,
  className,
  disableLink = true,
}: TournamentPairingRowProps): JSX.Element => {
  // TODO: Use column width hook
  const windowWidth = useWindowWidth();
  const orientation = windowWidth <= MOBILE_BREAKPOINT ? 'vertical' : 'horizontal';

  const [competitor0Props, competitor1Props] = getIdentityBadgeProps(pairing);

  return (
    <div
      className={clsx(styles.TournamentPairingRow, className)}
      data-orientation={orientation}
    >
      <IdentityBadge
        className={styles.TournamentPairingRow_Competitor0}
        size={orientation === 'vertical' ? 'small' : 'normal'}
        flipped={orientation === 'horizontal'}
        loading={loading}
        disableLink={disableLink}
        {...competitor0Props}
      />
      <span className={styles.TournamentPairingRow_Versus}>
        VS
      </span>
      <IdentityBadge
        className={styles.TournamentPairingRow_Competitor1}
        size={orientation === 'vertical' ? 'small' : 'normal'}
        loading={loading}
        disableLink={disableLink}
        {...competitor1Props}
      />
    </div>
  );
};
