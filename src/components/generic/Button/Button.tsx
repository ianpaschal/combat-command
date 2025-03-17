import {
  ButtonHTMLAttributes,
  Children,
  forwardRef,
  isValidElement,
} from 'react';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import { clsx } from 'clsx';

import { Spinner } from '~/components/generic/Spinner';
import { MOBILE_BREAKPOINT } from '~/settings';
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
  inverted?: boolean;
}

const cn = createCn('Button');

// TODO: Mobile hit-box is always 40 x 40 rather than width x 40
// TODO: X padding too large when there is an icon. Maybe switch to a icon / label / icon format

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'solid',
  muted,
  inverted = false,
  size: customSize,
  children,
  disabled = false,
  loading,
  intent,
  round,
  ...props
}, ref) => {
  const width = useWindowWidth();
  const size = customSize || (width <= MOBILE_BREAKPOINT ? 'large' : 'normal');
  const elements = Children.toArray(children);
  const classNames = clsx(
    cn(),
    cn(mod({ variant, intent, muted, inverted })),
    size !== null ? cn(`-size-${size}`) : undefined,
    {
      [cn('-round')]: round,
      [cn('-iconOnly')]: elements.length === 1 && isValidElement(elements[0]),
      [cn('-disabled')]: disabled,
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
