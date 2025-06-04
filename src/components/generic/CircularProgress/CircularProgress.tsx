import { CSSProperties, ReactNode } from 'react';
import clsx from 'clsx';

import { useElementSize } from '~/hooks/useElementSize';

import styles from './CircularProgress.module.scss';

export interface CircularProgressProps {
  total: number;
  filled: number;
  className?: string;
  size?: CSSProperties['width'] | number;
  children?: ReactNode;

  // Percentage of the overall width expressed between 0 and 1
  strokeWidth?: number;
  color?: 'green' | 'yellow' | 'red';
}

export const CircularProgress = ({
  total,
  filled,
  size = '8rem',
  children,
  strokeWidth = 4,
  color,
  className,
}: CircularProgressProps): JSX.Element => {
  const clampedTotal = Math.abs(total);
  const clampedFilled = Math.min(Math.max(filled, 0), clampedTotal);
  const [ref, width] = useElementSize();
  const radius = (width / 2) - (strokeWidth / 2);
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedFilled / clampedTotal) * circumference;
  return (
    <div ref={ref} className={clsx(styles.CircularProgress, className)} style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${width} ${width}`} width={width} height={width} style={{ shapeRendering: 'geometricPrecision' }}>
        <circle
          className={styles.CircularProgress_Track}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={width / 2}
          cy={width / 2}
        />
        <circle
          className={styles.CircularProgress_Fill}
          data-color={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={width / 2}
          cy={width / 2}
          transform={`rotate(-90 ${width / 2} ${width / 2})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease, color 0.5s ease' }}
        />
      </svg>
      {children && (
        <div className={styles.CircularProgress_InnerWrapper} style={{ inset: strokeWidth }}>
          {children}
        </div>
      )}
    </div>
  );
};
