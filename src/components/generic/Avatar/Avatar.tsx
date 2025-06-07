import { ReactElement } from 'react';
import { Image, Root } from '@radix-ui/react-avatar';
import clsx from 'clsx';
import { User, Users } from 'lucide-react';

import { FlagCircle } from '~/components/generic/FlagCircle';

import styles from './Avatar.module.scss';

export interface AvatarProps {
  className?: string;
  countryCode?: string;
  isTeam?: boolean;
  icon?: ReactElement;
  muted?: boolean;
  loading?: boolean;
  url?: string;
  userId?: string;
}

export const Avatar = ({
  className,
  countryCode,
  isTeam = false,
  muted = false,
  loading = false,
  icon,
  url,
}: AvatarProps): JSX.Element => {
  const getInnerContent = (): ReactElement | null => {
    if (loading) {
      return null;
    }
    if (icon) {
      return icon;
    }
    if (url) {
      return <Image className={styles.Image} src={url} />;
    }
    if (isTeam) {
      return <Users />;
    }
    return <User />;
  };
  return (
    <Root className={clsx(styles.Root, className)}>
      <div className={clsx(styles.Content, { [styles.ContentLoading]: loading, [styles['Content-muted']]: muted })}>
        {getInnerContent()}
      </div>
      {countryCode && (
        <FlagCircle className={styles.Flag} code={countryCode} />
      )}
    </Root>
  );
};
