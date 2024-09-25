import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import { Root as PortalRoot } from '@radix-ui/react-portal';
import clsx from 'clsx';

import { Button } from '~/components/generic/Button';

import './FloatingActionButton.scss';

type FloatingActionButtonRef = ElementRef<typeof Button>;
type FloatingActionButtonProps = ComponentPropsWithoutRef<typeof Button>;
export const FloatingActionButton = forwardRef<FloatingActionButtonRef, FloatingActionButtonProps>(({
  children,
  className,
  size = 'large',
  variant = 'solid',
  ...props
}, ref): JSX.Element => (
  <PortalRoot asChild>
    <Button
      ref={ref}
      className={clsx('FloatingActionButton', className)}
      size={size}
      variant={variant}
      round
      {...props}
    >
      {children}
    </Button>
  </PortalRoot>
));