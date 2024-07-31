import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

import { ButtonVariant } from '../Button';

import './IconButton.scss';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'small' | 'normal' | 'large';
  round?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
  className,
  round = false,
  variant = 'primary',
  size = 'normal',
  children,
  ...props
}, ref) => (
  <button
    className={clsx('IconButton', `IconButton-${variant}`, `IconButton-${size}`, { 'IconButton-round': round }, className)}
    ref={ref}
    {...props}
  >
    {children}
  </button>
));