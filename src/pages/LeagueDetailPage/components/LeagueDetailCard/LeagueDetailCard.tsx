import {
  cloneElement,
  HTMLAttributes,
  ReactElement,
} from 'react';
import clsx from 'clsx';

import { Card } from '~/components/generic/Card';

import styles from './LeagueDetailCard.module.scss';

export interface LeagueDetailCardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  buttons?: ReactElement[];
}

export const LeagueDetailCard = ({
  className,
  title,
  children,
  buttons,
  ...props
}: LeagueDetailCardProps): JSX.Element => (
  <Card className={clsx(styles.LeagueDetailCard, className)} {...props}>
    {(title || buttons?.length) && (
      <div className={styles.LeagueDetailCard_Header}>
        {title && (
          <h2>{title}</h2>
        )}
        {buttons && buttons.length > 0 && (
          <div className={styles.LeagueDetailCard_Header_Actions}>
            {buttons.map((button, i) => cloneElement(button, { key: i }))}
          </div>
        )}
      </div>
    )}
    {children}
  </Card>
);
