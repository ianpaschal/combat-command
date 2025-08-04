import { cloneElement } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import { TournamentCompetitor, User } from '~/api';
import { PATHS } from '~/settings';
import { ElementSize } from '~/types/componentLib';
import { useIdentityElements } from './IdentityBadge.hooks';
import { IdentityBadgePlaceholder } from './IdentityBadge.types';

import styles from './IdentityBadge.module.scss';

const sizeClasses: Record<ElementSize, string | undefined> = {
  'tiny': styles['IdentityBadge-tiny'],
  'small': styles['IdentityBadge-small'],
  'normal': undefined,
  'large': styles['IdentityBadge-large'],
};

export interface IdentityBadgeProps {
  className?: string;
  competitor?: TournamentCompetitor;
  flipped?: boolean;
  loading?: boolean;
  placeholder?: IdentityBadgePlaceholder;
  size?: ElementSize;
  user?: User;
}

export const IdentityBadge = ({
  className,
  competitor,
  flipped = false,
  loading = false,
  placeholder,
  size = 'normal',
  user,
}: IdentityBadgeProps): JSX.Element | null => {
  const navigate = useNavigate();

  const [displayAvatar, displayName] = useIdentityElements({
    user,
    competitor,
    placeholder,
  }, loading);
  const elements = [
    cloneElement(displayAvatar, { className: styles.IdentityBadge_Avatar, key: 'avatar' }),
    cloneElement(displayName, {
      className: clsx(styles.IdentityBadge_Name, {
        [styles['IdentityBadge_Name-placeholder']]: !!placeholder,
      }), key: 'displayName',
    }),
    // TODO: Add claim button
  ];
  const type = user ? 'user' : 'competitor';
  return (
    <div
      className={clsx(styles.IdentityBadge, sizeClasses[size], className)}
      data-flipped={flipped}
      data-type={type}
      onClick={() => user ? navigate(generatePath(PATHS.userProfile, { id: user._id })) : null}
    >
      {flipped ? elements.reverse() : elements}
      {/* TODO: Add factions */}
    </div>
  );
};
