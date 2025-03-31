import { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

import styles from './TournamentTabHeader.module.scss';

export interface TournamentTabHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  buttons?: ReactNode[];
}

export const TournamentTabHeader = ({
  className,
  title,
  buttons,
}: TournamentTabHeaderProps): JSX.Element => (
  <div className={clsx(styles.TournamentTabHeader, className)}>
    <h2>{title}</h2>
    {buttons && buttons.length && (
      <div className={styles.TournamentTabHeader_Actions}>
        {buttons}
      </div>
    )}
  </div>
);
