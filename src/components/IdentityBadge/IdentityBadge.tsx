import { cloneElement } from 'react';
import clsx from 'clsx';

import { TournamentCompetitor, User } from '~/api';
import { useDisplayAvatar, useDisplayName } from './IdentityBadge.hooks';

import styles from './IdentityBadge.module.scss';

type Size = 'small' | 'normal' | 'large';

const sizeClasses: Record<Size, string | undefined> = {
  'small': styles['IdentityBadge-small'],
  'normal': undefined,
  'large': styles['IdentityBadge-large'],
};

export interface IdentityBadgeProps {
  user?: User;
  competitor?: TournamentCompetitor;
  className?: string;
  size?: Size;
}

export const IdentityBadge = ({
  user,
  competitor,
  className: extraClassName,
  size = 'normal',
}: IdentityBadgeProps): JSX.Element | null => {
  const displayName = useDisplayName({ user, competitor });
  const displayAvatar = useDisplayAvatar({ user, competitor });
  if (!user && !competitor) {
    return null;
  }
  return (
    <div className={clsx(styles.IdentityBadge, sizeClasses[size], extraClassName)}>
      {displayAvatar && cloneElement(displayAvatar, { className: styles.IdentityBadge_Avatar })}
      <div className={styles.IdentityBadge_Name}>
        {displayName}
      </div>
      {/* TODO: Add factions */}
    </div>
  );
};
