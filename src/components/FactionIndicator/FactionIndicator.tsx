import { getAlignmentDisplayName } from '@ianpaschal/combat-command-game-systems/common';
import clsx from 'clsx';

import { Alignment, Faction } from '~/api';
import { InfoPopover } from '~/components/generic/InfoPopover';
import { getAlignmentColor } from './FactionIndicator.utils';

import styles from './FactionIndicator.module.scss';

export interface FactionIndicatorProps {
  alignments: Alignment[];
  factions: Faction[];
  className?: string;
}

export const FactionIndicator = ({
  alignments,
  // factions,
  className,
}: FactionIndicatorProps): JSX.Element => {

  // FIXME: Be smarter about showing competitors (teams) with multiple alignments
  const primaryAlignment = alignments[0];

  const color = getAlignmentColor(primaryAlignment);
  const displayName = getAlignmentDisplayName(primaryAlignment) ?? 'Unknown Alignment';

  return (
    <InfoPopover content={displayName}>
      <div className={clsx(styles.FactionIndicator, className)} data-color={color}>
        <div className={styles.FactionIndicator_Ring} />
        <div className={styles.FactionIndicator_Center} />
      </div>
    </InfoPopover>
  );
};
