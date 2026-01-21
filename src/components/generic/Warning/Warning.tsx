import { ReactNode } from 'react';
import clsx from 'clsx';
import { TriangleAlert } from 'lucide-react';

import { ElementIntent } from '~/types/componentLib';

import styles from './Warning.module.scss';

export interface WarningProps {
  children?: ReactNode;
  className?: string;
  description?: string;
  intent?: ElementIntent;
  title?: string;
}

export const Warning = ({
  children,
  className,
  description,
  intent = 'warning',
  title,
}: WarningProps): JSX.Element => (
  <div className={clsx(styles.Warning, className)} data-intent={intent}>
    <TriangleAlert className={styles.Warning_Icon} />
    <h3 className={styles.Warning_Header}>
      {title ?? 'Warning'}
    </h3>
    {(children || description) && (
      <div className={styles.Warning_Body}>
        {description}
        {children}
      </div>
    )}
  </div>
);
