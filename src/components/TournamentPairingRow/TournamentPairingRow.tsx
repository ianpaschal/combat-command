import { useWindowWidth } from '@react-hook/window-size/throttled';
import clsx from 'clsx';

import {
  DraftPairing,
  TournamentPairing,
  UnassignedPairingInput,
} from '~/api';
import { IdentityBadge } from '~/components/IdentityBadge';
import { MOBILE_BREAKPOINT } from '~/settings';

import { getIdentityBadgeProps } from './TournamentPairingRow.utils';

import styles from './TournamentPairingRow.module.scss';

export interface TournamentPairingRowProps {
  pairing?: TournamentPairing | DraftPairing | UnassignedPairingInput;
  loading?: boolean;
  className?: string;
}

export const TournamentPairingRow = ({
  pairing,
  loading = false,
  className,
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
      <IdentityBadge flipped={orientation === 'horizontal'} loading={loading} {...competitor0Props} />
      <span className={styles.TournamentPairingRow_Versus}>
        VS
      </span>
      <IdentityBadge loading={loading} {...competitor1Props} />
    </div>
  );
};
