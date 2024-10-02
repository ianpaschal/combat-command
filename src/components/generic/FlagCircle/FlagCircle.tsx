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
  size = '2.5rem',
}: FlagCircleProps): JSX.Element => (
  <div
    className={clsx('FlagCircle', 'fis', `fi-${code}`, className)}
    style={size ? { width: size, height: size } : {}}
  />
);