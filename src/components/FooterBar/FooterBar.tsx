import { ReactNode } from 'react';
import clsx from 'clsx';

import { MAX_WIDTH } from '~/settings';

import styles from './FooterBar.module.scss';

export interface FooterBarProps {
  className?: string;
  children?: ReactNode;
  maxWidth?: string | number;
}

export const FooterBar = ({
  maxWidth = MAX_WIDTH,
  children,
  className,
}: FooterBarProps): JSX.Element => (
  <div className={styles.Root}>
    <div className={clsx(styles.Content, className)} style={{ maxWidth }}>
      {children}
    </div>
  </div>
);
