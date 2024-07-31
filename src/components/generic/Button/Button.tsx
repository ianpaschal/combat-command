import {
  ButtonHTMLAttributes,
  forwardRef,
  ReactNode,
} from 'react';
import { clsx } from 'clsx';

import './Button.scss';

export type ButtonVariant = 'solid' | 'solid-muted' | 'outline' | 'outline-muted' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  slotBefore?: ReactNode;
  slotAfter?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'solid',
  children,
  slotBefore,
  slotAfter,
  ...props
}, ref) => (
  <button
    className={clsx('Button', `Button-${variant}`, className)}
    ref={ref}
    {...props}
  >
    {slotBefore && (
      <div className={clsx('Button-slotBefore')}>
        {slotBefore}
      </div>
    )}
    {children}
    {slotAfter && (
      <div className={clsx('Button-slotAfter')}>
        {slotAfter}
      </div>
    )}
  </button>
));