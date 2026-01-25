import {
  cloneElement,
  HTMLAttributes,
  ReactElement,
  ReactNode,
} from 'react';
import clsx from 'clsx';

import { Card } from '~/components/generic/Card';

import styles from './TournamentDetailCard.module.scss';

export interface TournamentDetailCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  buttons?: ReactElement[];
}

export const TournamentDetailCard = ({
  className,
  title,
  children,
  buttons,
  ...props
}: TournamentDetailCardProps): JSX.Element => (
  <Card className={clsx(styles.TournamentDetailCard, className)} {...props}>
    {(title || buttons?.length) && (
      <div className={styles.TournamentDetailCard_Header}>
        {title && (
          <h2>{title}</h2>
        )}
        {buttons && buttons.length > 0 && (
          <div className={styles.TournamentDetailCard_Header_Actions}>
            {buttons.map((button, i) => cloneElement(button, { key: i }))}
          </div>
        )}
      </div>
    )}
    {children}
  </Card>
);
