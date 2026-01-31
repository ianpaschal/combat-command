import { forwardRef, MouseEvent } from 'react';
import clsx from 'clsx';

import styles from './Pulsar.module.scss';

interface PulsarProps {
  className?: string;
  size?: number;
  color?: 'red' | 'yellow' | 'green' | 'blue';
  visible?: boolean;
  pulse?: boolean;
  onClick?: (e: MouseEvent) => void;
}

export const Pulsar = forwardRef<HTMLDivElement, PulsarProps>(({
  className,
  size = 8,
  color = 'blue',
  visible = true,
  pulse = true,
  onClick,
}, ref) => (
  <div
    ref={ref}
    className={clsx(styles.Pulsar, className)}
    data-visible={visible}
    data-color={color}
    onClick={onClick ? (e) => {
      // e.preventDefault();
      onClick(e);
    } : undefined}
    style={{
      width: size,
      minWidth: size,
      maxWidth: size,
      height: size,
      minHeight: size,
      maxHeight: size,
    }}
  >
    {pulse && <span className={styles.Pulse} />}
  </div>
));

Pulsar.displayName = 'Pulsar';
