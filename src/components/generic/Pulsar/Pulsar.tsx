import { forwardRef, MouseEvent } from 'react';

import styles from './Pulsar.module.scss';

interface PulsarProps {
  size?: number;
  color?: 'red' | 'yellow' | 'green' | 'blue';
  visible?: boolean;
  pulse?: boolean;
  onClick?: (e: MouseEvent) => void;
}

export const Pulsar = forwardRef<HTMLDivElement, PulsarProps>(({
  size = 8,
  color = 'blue',
  visible = true,
  pulse = true,
  onClick,
}, ref) => (
  <div
    ref={ref}
    className={styles.Pulsar}
    data-visible={visible}
    data-color={color}
    onClick={onClick ? (e) => {
      // e.preventDefault();
      onClick(e);
    } : undefined}
    style={{
      width: `${size}px`,
      height: `${size}px`,
    }}
  >
    {pulse && <span className={styles.Pulse} />}
  </div>
));

Pulsar.displayName = 'Pulsar';
