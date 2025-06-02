import { CSSProperties, ReactNode } from 'react';
import clsx from 'clsx';

import styles from './CircularProgress.module.scss';

export interface CircularProgressProps {
  // Percentage expressed between 0 and 1
  percentage: number;
  className?: string;
  size?: CSSProperties['width'];
  children?: ReactNode;

  // Percentage of the overall width expressed between 0 and 1
  strokeWidth?: number;
  color?: string;
}

export const CircularProgress = ({
  percentage,
  size = '8rem',
  children,
  strokeWidth = 0.125,
  color,
  className,
}: CircularProgressProps): JSX.Element => {
  const svgSize = 100;
  const ratio = Math.min(Math.max(percentage, 0), 1);
  const strokeWidthAbsolute = Math.min(Math.max(strokeWidth, 0), 0.25) * svgSize;
  const radius = (svgSize / 2) - (strokeWidthAbsolute / 2);
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ratio * circumference;
  return (
    <div className={clsx(styles.CircularProgress, className)} style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${svgSize} ${svgSize}`} width="100%" height="100%">
        <circle
          className={styles.CircularProgress_Track}
          fill="transparent"
          strokeWidth={strokeWidthAbsolute}
          r={radius}
          cx={svgSize / 2}
          cy={svgSize / 2}
        />
        <circle
          className={styles.CircularProgress_Fill}
          fill="transparent"
          strokeWidth={strokeWidthAbsolute}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={svgSize / 2}
          cy={svgSize / 2}
          transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease', stroke: color }}
        />
      </svg>
      {children && (
        <div className={styles.CircularProgress_InnerWrapper}>
          {children}
        </div>
      )}
    </div>
  );
};
