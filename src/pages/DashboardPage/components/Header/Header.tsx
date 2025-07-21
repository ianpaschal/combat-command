import { ReactNode } from 'react';
import clsx from 'clsx';

import styles from './Header.module.scss';

export interface HeaderProps {
  className?: string;
  title: ReactNode | string;
  children?: ReactNode;
}

export const Header = ({
  className,
  title,
  children,
}: HeaderProps): JSX.Element => (
  <div className={clsx(styles.Header, className)}>
    {typeof title === 'string' ? (
      <h2>
        {title}
      </h2>
    ) : title}
    {children && (
      <div className={styles.Header_Actions}>
        {children}
      </div>
    )}
  </div>
);
