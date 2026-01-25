import { getAlignmentDisplayName } from '@ianpaschal/combat-command-game-systems/common';
import clsx from 'clsx';

import { Alignment, Faction } from '~/api';
import { InfoPopover } from '~/components/generic/InfoPopover';

import styles from './AlignmentIndicator.module.scss';

export interface AlignmentIndicatorProps {
  alignments: Alignment[];
  factions: Faction[];
  className?: string;
}

export const AlignmentIndicator = ({
  alignments,
  // factions,
  className,
}: AlignmentIndicatorProps): JSX.Element => {

  // FIXME: Be smarter about showing competitors (teams) with multiple alignments
  const primaryAlignment = alignments[0];

  let primaryAlignmentColor = 'mixed';
  if (['allies', 'nato'].includes(primaryAlignment)) {
    primaryAlignmentColor = 'blue';
  }
  if (['axis', 'warsaw_pact'].includes(primaryAlignment)) {
    primaryAlignmentColor = 'red';
  }

  return (
    <InfoPopover content={getAlignmentDisplayName(primaryAlignment) ?? 'Unknown Alignment'}>
      <div className={clsx(styles.FactionIndicator, className)} data-color={primaryAlignmentColor}>
        <div className={styles.FactionIndicator_Ring} />
        <div className={styles.FactionIndicator_Center} />
      </div>
    </InfoPopover>
  );
};
