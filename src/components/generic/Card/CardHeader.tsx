import { ReactNode } from 'react';
import clsx from 'clsx';

import styles from './CardHeader.module.scss';

export interface CardHeaderProps {
  className?: string;
  title: ReactNode | string;
  children?: ReactNode;
}

export const CardHeader = ({
  className,
  title,
  children,
}: CardHeaderProps): JSX.Element => (
  <div className={clsx(styles.CardHeader, className)}>
    {typeof title === 'string' ? (
      <h2>
        {title}
      </h2>
    ) : title}
    {children && (
      <div className={styles.CardHeader_Actions}>
        {children}
      </div>
    )}
  </div>
);
