import { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

import { Card } from '~/components/generic/Card';
import { TournamentTabHeader } from './TournamentTabHeader';

import styles from './TournamentDetailsCard.module.scss';

export interface TournamentDetailsCardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  buttons?: ReactNode[];
}

export const TournamentDetailsCard = ({
  className,
  title,
  children,
  buttons,
  ...props
}: TournamentDetailsCardProps): JSX.Element => (
  <Card className={clsx(styles.TournamentDetailsCard, className)} {...props}>
    {title && (
      <TournamentTabHeader title={title} buttons={buttons} />
    )}
    {children}
  </Card>
);
