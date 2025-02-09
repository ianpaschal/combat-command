import {
  cloneElement,
  CSSProperties,
  ReactElement,
} from 'react';
import { Image, Root } from '@radix-ui/react-avatar';
import clsx from 'clsx';
import { User } from 'lucide-react';

import { FlagCircle } from '~/components/generic/FlagCircle';
import { useFetchAvatar } from '~/services/avatar/useFetchAvatar';
import { useFetchUserProfile } from '~/services/userProfile/useFetchUserProfile';

import styles from './Avatar.module.scss';

export interface BadgeConfig {
  position: 'top' | 'top-left' | 'top-right' | 'left' | 'right' | 'bottom' | 'bottom-left' | 'bottom-right';
  size?: string | number;
  element: ReactElement;
  overhang?: boolean;
}

export interface AvatarProps {
  badges?: BadgeConfig[];
  className?: string;
  countryCode?: string;
  loading?: boolean;
  size?: CSSProperties['width'];
  userId?: string;
}

export const Avatar = ({
  badges: badgeConfigs,
  className,
  countryCode,
  loading,
  size = 40,
  userId,
}: AvatarProps): JSX.Element => {
  const { data: userProfile, isLoading: isUserProfileLoading } = useFetchUserProfile(userId);
  const { data: avatar, isFetching: isAvatarFetching } = useFetchAvatar(userProfile?.avatar_url);
  const badges = badgeConfigs?.map((config) => {
    const convertToPascalCase = (text: string): string => (
      text.replace(/(^\w|-\w)/g, (t) => t.replace(/-/, '').toUpperCase())
    );
    const className = clsx(
      'Badge',
      `Badge${convertToPascalCase(config.position)}`,
    );

    const style = config.size ? {
      // width: config.size,
      // height: config.size,
    } : undefined;
    return (
      <div className={className} style={style}>
        {cloneElement(config.element, { style })}
      </div>
    );
  });

  if (!avatar) {
    console.log('rendering without avatar');
  }

  const isLoading = loading || (!userProfile && isUserProfileLoading) || (!avatar && isAvatarFetching);

  return (
    <Root className={clsx(styles.Root, className)} style={{ width: size, height: size }}>
      <div className={clsx(styles.Content, { [styles.ContentLoading]: isLoading })}>
        {avatar ? (
          <Image className={styles.Image} src={avatar} />
        ) : (
          <User />
        )}
      </div>
      {badges}
      {countryCode && (
        <FlagCircle className={styles.Flag} code={countryCode} size={`calc(${size} / 3`} />
      )}
    </Root>
  );
};