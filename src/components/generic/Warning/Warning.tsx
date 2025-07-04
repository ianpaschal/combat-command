import { ReactNode } from 'react';
import clsx from 'clsx';
import { TriangleAlert } from 'lucide-react';

import styles from './Warning.module.scss';

export interface WarningProps {
  className?: string;
  children: ReactNode;
}

export const Warning = ({
  className,
  children,
}: WarningProps): JSX.Element => (
  <div className={clsx(styles.Warning, className)}>
    <TriangleAlert className={styles.Warning_Icon} />
    <h3 className={styles.Warning_Header}>
      Warning
    </h3>
    <div className={styles.Warning_Body}>
      {children}
    </div>
  </div>
);
