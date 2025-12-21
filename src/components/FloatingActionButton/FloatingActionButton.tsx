import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import clsx from 'clsx';
import { Portal } from 'radix-ui';

import { Button } from '~/components/generic/Button';

import './FloatingActionButton.scss';

type FloatingActionButtonRef = ElementRef<typeof Button>;
type FloatingActionButtonProps = ComponentPropsWithoutRef<typeof Button>;
export const FloatingActionButton = forwardRef<FloatingActionButtonRef, FloatingActionButtonProps>(({
  className,
  size = 'large',
  variant = 'primary',
  ...props
}, ref): JSX.Element => (
  <Portal.Root asChild>
    <Button
      ref={ref}
      className={clsx('FloatingActionButton', className)}
      rounded
      size={size}
      variant={variant}
      {...props}
    />
  </Portal.Root>
));
