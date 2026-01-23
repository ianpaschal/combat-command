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
  factions,
  className,
}: AlignmentIndicatorProps): JSX.Element => {

  // FIXME: Be smarter about showing competitors (teams) with multiple alignments
  const primaryAlignment = alignments[0];

  let primaryAlignmentColor = 'purple';
  if (['allies', 'nato'].includes(primaryAlignment)) {
    primaryAlignmentColor = 'blue';
  }
  if (['axis', 'warsaw_pact'].includes(primaryAlignment)) {
    primaryAlignmentColor = 'red';
  }

  return (
    <div className={clsx(styles.AlignmentIndicator, className)}>
      <InfoPopover content={getAlignmentDisplayName(primaryAlignment) ?? 'Unknown Alignment'}>
        <div className={styles.AlignmentIndicator_Alignment} data-color={primaryAlignmentColor} />
      </InfoPopover>
      <InfoPopover content={getAlignmentDisplayName(primaryAlignment) ?? 'Unknown Alignment'}>
        <div className={styles.AlignmentIndicator_Faction} data-color={primaryAlignmentColor} />
      </InfoPopover>
      <InfoPopover content={getAlignmentDisplayName(primaryAlignment) ?? 'Unknown Alignment'}>
        <div className={styles.AlignmentIndicator_Faction} data-color={primaryAlignmentColor} />
      </InfoPopover>
      <InfoPopover content={getAlignmentDisplayName(primaryAlignment) ?? 'Unknown Alignment'}>
        <div className={styles.AlignmentIndicator_Faction} data-color={primaryAlignmentColor} />
      </InfoPopover>
      {factions.map((faction) => (
        <InfoPopover key={faction} content={getAlignmentDisplayName(faction) ?? 'Unknown Faction'}>
          <div className={styles.AlignmentIndicator_Faction} />
        </InfoPopover>
      ))}
    </div>
  );
};
