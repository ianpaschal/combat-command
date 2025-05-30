import { cloneElement } from 'react';
import clsx from 'clsx';

import { TournamentCompetitor, User } from '~/api';
import { IdentityBadgePlaceholder } from '~/components/IdentityBadge/IdentityBadge.types';
import { ElementSize } from '~/types/componentLib';

import { useDisplayAvatar, useDisplayName } from './IdentityBadge.hooks';

import styles from './IdentityBadge.module.scss';

const sizeClasses: Record<ElementSize, string | undefined> = {
  'tiny': styles['IdentityBadge-tiny'],
  'small': styles['IdentityBadge-small'],
  'normal': undefined,
  'large': styles['IdentityBadge-large'],
};

export interface IdentityBadgeProps {
  user?: User;
  competitor?: TournamentCompetitor;
  placeholder?: IdentityBadgePlaceholder;
  className?: string;
  size?: ElementSize;
  flipped?: boolean;
}

export const IdentityBadge = ({
  user,
  competitor,
  placeholder,
  className,
  size = 'normal',
  flipped = false,
}: IdentityBadgeProps): JSX.Element | null => {
  const displayName = useDisplayName({ user, competitor, placeholder });
  const displayAvatar = useDisplayAvatar({ user, competitor, placeholder });
  const elements = [
    cloneElement(displayAvatar, { className: styles.IdentityBadge_Avatar, key: 'avatar' }),
    cloneElement(displayName, {
      className: clsx(styles.IdentityBadge_Name, {
        [styles['IdentityBadge_Name-placeholder']]: !!placeholder,
      }), key: 'displayName',
    }),
    // TODO: Add claim button
  ];
  return (
    <div className={clsx(styles.IdentityBadge, sizeClasses[size], className)}>
      {flipped ? elements.reverse() : elements}
      {/* TODO: Add factions */}
    </div>
  );
};
