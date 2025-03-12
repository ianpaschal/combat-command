import { sentenceCase } from 'change-case';
import clsx from 'clsx';
import { formatDistance } from 'date-fns';

import styles from './Timestamp.module.scss';

export interface TimestampProps {
  className?: string;
  date: Date;
}

export const Timestamp = ({
  className,
  date,
}: TimestampProps): JSX.Element => (
  <span className={clsx(styles.Timestamp, className)}>
    {sentenceCase(formatDistance(date, new Date(), {
      addSuffix: true,
    }))}
  </span>
);
