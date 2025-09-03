import {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
} from 'react';
import clsx from 'clsx';

import styles from './InputText.module.scss';

export interface InputTextProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  slotBefore?: ReactNode;
  slotAfter?: ReactNode;
  hasError?: boolean;
  size?: 'small' | 'normal' | 'large';
}

export const InputText = forwardRef<HTMLInputElement, InputTextProps>(({
  className,
  type,
  hasError = false,
  slotBefore,
  slotAfter,
  disabled,
  size = 'normal',
  ...props
}, ref) => (
  <div
    className={clsx(styles.InputWrapper, className)}
    data-size={size}
  >
    <input
      type={type}
      className={clsx(styles.Input, {
        [styles['Input-slotAfter']]: !!slotAfter,
        [styles['Input-slotBefore']]: !!slotBefore,
        [styles['InputWrapper-hasError']]: hasError,
        [styles['InputWrapper-disabled']]: disabled,
      }, className)}
      ref={ref}
      disabled={disabled}
      {...props}
    />
    {slotBefore && (
      <div className={styles.InputSlotBefore}>
        {slotBefore}
      </div>
    )}
    {slotAfter && (
      <div className={styles.InputSlotAfter}>
        {slotAfter}
      </div>
    )}
  </div>
));
InputText.displayName = 'InputText';
