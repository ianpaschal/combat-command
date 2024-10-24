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
import { createCn } from '~/utils/componentLib/createCn';
import { mod } from '~/utils/componentLib/mod';

import './Button.scss';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ElementVariant;
  intent?: ElementIntent;
  muted?: boolean;
  size?: ElementSize;
  round?: boolean;
  loading?: boolean;
}

const cn = createCn('Button');

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'solid',
  muted,
  size = 'normal',
  children,
  disabled,
  loading,
  intent,
  round,
  ...props
}, ref) => {
  const elements = Children.toArray(children);
  const classNames = clsx(
    cn(),
    cn(mod({ variant, intent, muted })),
    size !== null ? cn(`-size-${size}`) : undefined,
    {
      [cn('-round')]: round,
      [cn('-iconOnly')]: elements.length === 1 && isValidElement(elements[0]),
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
