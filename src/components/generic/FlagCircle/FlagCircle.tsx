import clsx from 'clsx';

import '/node_modules/flag-icons/css/flag-icons.min.css';
import './FlagCircle.scss';

export interface FlagCircleProps {
  className?: string;
  code: string;
}

export const FlagCircle = ({
  className,
  code,
}: FlagCircleProps): JSX.Element => {
  if (code === 'merc') {
    return (
      <div
        className={clsx('FlagCircle', 'FlagCircle-merc', className)}
      />
    );
  }
  return (
    <div
      className={clsx('FlagCircle', 'fis', `fi-${code}`, className)}
    />
  );
};
