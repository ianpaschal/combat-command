import { CSSProperties } from 'react';
import { Image, Root } from '@radix-ui/react-avatar';
import clsx from 'clsx';
import { User } from 'lucide-react';

import { FlagCircle } from '~/components/generic/FlagCircle';

import styles from './Avatar.module.scss';

export interface AvatarProps {
  url?: string;
  className?: string;
  countryCode?: string;
  loading?: boolean;
  size?: CSSProperties['width'];
  userId?: string;
}

export const Avatar = ({
  url,
  className,
  countryCode,
  loading,
  size = 40,
}: AvatarProps): JSX.Element => {
  const getInnerContent = (): JSX.Element | null => {
    if (loading) {
      return null;
    }
    if (url) {
      return <Image className={styles.Image} src={url} />;
    }
    return <User />;
  };
  return (
    <Root className={clsx(styles.Root, className)} style={{ width: size, height: size }}>
      <div className={clsx(styles.Content, { [styles.ContentLoading]: loading })}>
        {getInnerContent()}
      </div>
      {countryCode && (
        <FlagCircle className={styles.Flag} code={countryCode} size={`calc(${size} / 3`} />
      )}
    </Root>
  );
};
