import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  ReactElement,
} from 'react';
import clsx from 'clsx';
import { User, Users } from 'lucide-react';
import { Avatar as RadixAvatar } from 'radix-ui';

import { FlagCircle } from '~/components/generic/FlagCircle';

import styles from './Avatar.module.scss';

export type AvatarRef = ElementRef<typeof RadixAvatar.Root>;
export type AvatarProps = ComponentPropsWithoutRef<typeof RadixAvatar.Root> & {
  className?: string;
  countryCode?: string;
  isTeam?: boolean;
  icon?: ReactElement;
  muted?: boolean;
  loading?: boolean;
  url?: string;
  userId?: string;
};

export const Avatar = forwardRef<AvatarRef, AvatarProps>(({
  className,
  countryCode,
  isTeam = false,
  muted = false,
  loading = false,
  icon,
  url,
}, ref) => {
  const getInnerContent = (): ReactElement | null => {
    if (loading) {
      return null;
    }
    if (icon) {
      return icon;
    }
    if (url) {
      return <RadixAvatar.Image className={styles.Image} src={url} />;
    }
    if (isTeam) {
      return <Users />;
    }
    return <User />;
  };
  return (
    <RadixAvatar.Root ref={ref} className={clsx(styles.Root, className)}>
      <div className={clsx(styles.Content, { [styles.ContentLoading]: loading, [styles['Content-muted']]: muted })}>
        {getInnerContent()}
      </div>
      {countryCode && (
        <FlagCircle className={styles.Flag} code={countryCode} />
      )}
    </RadixAvatar.Root>
  );
});

Avatar.displayName = RadixAvatar.Root.displayName;
