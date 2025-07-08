import clsx from 'clsx';

import '/node_modules/flag-icons/css/flag-icons.min.css';
import styles from './FlagCircle.module.scss';

const customCodes = [
  'xx-lkt',
  'xx-mrc',
  'xx-prt',
];

export interface FlagCircleProps {
  className?: string;
  code: string;
}

export const FlagCircle = ({
  className,
  code,
}: FlagCircleProps): JSX.Element => {
  if (customCodes.includes(code)) {
    return (
      <div
        className={clsx(styles.FlagCircle, styles.FlagCircleCustom, className)}
        data-code={code}
      />
    );
  }
  return (
    <div
      className={clsx(styles.FlagCircle, 'fis', `fi-${code}`, className)}
    />
  );
};
