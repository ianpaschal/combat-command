import { cloneElement } from 'react';
import clsx from 'clsx';

import {
  TournamentCompetitor,
  TournamentCompetitorId,
  User,
  UserId,
} from '~/api';
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
  competitorId?: TournamentCompetitorId;
  flipped?: boolean;
  loading?: boolean;
  placeholder?: IdentityBadgePlaceholder;
  size?: ElementSize;
  user?: User;
  userId?: UserId;
}

export const IdentityBadge = ({
  className,
  competitor,
  competitorId,
  flipped = false,
  loading = false,
  placeholder,
  size = 'normal',
  user,
  userId,
}: IdentityBadgeProps): JSX.Element | null => {
  const [displayAvatar, displayName] = useIdentityElements({
    user,
    competitor,
    placeholder,
    competitorId,
    userId,
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
  return (
    <div className={clsx(styles.IdentityBadge, sizeClasses[size], className)}>
      {flipped ? elements.reverse() : elements}
      {/* TODO: Add factions */}
    </div>
  );
};
