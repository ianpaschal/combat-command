import {
  cloneElement,
  ReactElement,
  ReactNode,
} from 'react';
import clsx from 'clsx';
import { Satellite } from 'lucide-react';

import styles from './TournamentTabEmptyState.module.scss';

export interface TournamentTabEmptyStateProps {
  className?: string;
  children?: ReactNode;
  icon?: ReactElement;
  message?: string;
}

export const TournamentTabEmptyState = ({
  className,
  message,
  icon,
  children,
}: TournamentTabEmptyStateProps): JSX.Element => {
  const iconProps = {
    className: styles.TournamentTabEmptyState_Icon,
    size: 96,
    absoluteStrokeWidth: true,
    strokeWidth: 4,
  };
  return (
    <div className={clsx(styles.TournamentTabEmptyState, className)}>
      {icon ? cloneElement(icon, iconProps) : <Satellite {...iconProps} />}
      <div className={styles.TournamentTabEmptyState_Message}>
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
