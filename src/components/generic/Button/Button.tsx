import {
  ButtonHTMLAttributes,
  forwardRef,
  ReactElement,
} from 'react';
import clsx from 'clsx';

import { Spinner } from '~/components/generic/Spinner';
import {
  ElementIntent,
  ElementSize,
  ElementVariant,
} from '~/types/componentLib';

import styles from './Button.module.scss';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  className?: string;
  icon?: ReactElement;
  iconPosition?: 'start' | 'end';
  intent?: ElementIntent;
  loading?: boolean;
  round?: boolean;
  size?: ElementSize;
  text?: string;
  variant?: ElementVariant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  icon,
  iconPosition,
  intent = 'default',
  loading = false,
  round,
  size = 'normal',
  text,
  variant = 'primary',
  ...props
}, ref): JSX.Element => (
  <button
    ref={ref}
    className={clsx(styles.Button, className)}
    data-intent={intent}
    data-reverse={iconPosition === 'end'}
    data-round={round}
    data-size={size}
    data-variant={variant}
    {...props}
  >
    {icon && !loading && (
      icon
    )}
    {loading && (
      <Spinner className={styles.Button_Icon} />
    )}
    {text && (
      <span className={styles.Button_Text}>{text}</span>
    )}
  </button>
));
