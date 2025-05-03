import {
  ButtonHTMLAttributes,
  Children,
  forwardRef,
  isValidElement,
} from 'react';
import { clsx } from 'clsx';

import { Spinner } from '~/components/generic/Spinner';
import {
  ElementIntent,
  ElementSize,
  ElementVariant,
} from '~/types/componentLib';

import styles from './Button.module.scss';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ElementVariant;
  intent?: ElementIntent;
  size?: ElementSize;
  round?: boolean;
  loading?: boolean;
}

// TODO: Mobile hit-box is always 40 x 40 rather than width x 40
// TODO: X padding too large when there is an icon. Maybe switch to a icon / label / icon format

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'primary',
  size: customSize,
  children,
  disabled = false,
  loading = false,
  intent = 'default',
  round,
  ...props
}, ref) => {
  const size = customSize || 'normal';
  const elements = Children.toArray(children);
  const classNames = clsx(
    styles.Button,
    styles[`Button-${variant}-${intent}`],
    styles[`Button-${size}`],
    {
      [styles['Button-round']]: round,
      [styles['Button-iconOnly']]: elements.length === 1 && isValidElement(elements[0]),
    },
    className,
  );
  return (
    <button className={classNames} ref={ref} {...props} disabled={disabled || loading}>
      {loading && (
        <Spinner />
      )}
      {children}
    </button>
  );
});
