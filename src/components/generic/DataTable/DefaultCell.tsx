import clsx from 'clsx';

import styles from './DefaultCell.module.scss';

export interface DefaultCellProps {
  value: string | number;
  className?: string;
}

export const DefaultCell = ({
  value,
  className,
}: DefaultCellProps): JSX.Element => (
  <div className={clsx(styles.Root, className)}>
    {value}
  </div>
);
