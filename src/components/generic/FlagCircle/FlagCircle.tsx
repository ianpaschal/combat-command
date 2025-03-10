import clsx from 'clsx';

import '/node_modules/flag-icons/css/flag-icons.min.css';
import './FlagCircle.scss';

export interface FlagCircleProps {
  className?: string;
  code: string;
  size?: string | number;
}

export const FlagCircle = ({
  className,
  code,
  size,
}: FlagCircleProps): JSX.Element => {
  if (code === 'merc') {
    return (
      <div
        className={clsx('FlagCircle', 'FlagCircle-merc', className)}
        style={size ? { width: size, height: size } : {}}
      />
    );
  }
  return (
    <div
      className={clsx('FlagCircle', 'fis', `fi-${code}`, className)}
      style={size ? { width: size, height: size } : {}}
    />
  );
};
