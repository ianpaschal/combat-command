import {
  cloneElement,
  ReactElement,
  ReactNode,
} from 'react';
import clsx from 'clsx';
import { Satellite } from 'lucide-react';

import styles from './EmptyState.module.scss';

export interface EmptyStateProps {
  className?: string;
  children?: ReactNode;
  icon?: ReactElement;
  message?: string;
}

export const EmptyState = ({
  className,
  message,
  icon,
  children,
}: EmptyStateProps): JSX.Element => {
  const iconProps = {
    className: styles.EmptyState_Icon,
    size: 96,
    absoluteStrokeWidth: true,
    strokeWidth: 4,
  };
  return (
    <div className={clsx(styles.EmptyState, className)}>
      {icon ? cloneElement(icon, iconProps) : <Satellite {...iconProps} />}
      <div className={styles.EmptyState_Message}>
        {message ?? 'Nothing to show yet.'}
      </div>
      {children && (
        <div>
          {children}
        </div>
      )}
    </div>
  );
};
