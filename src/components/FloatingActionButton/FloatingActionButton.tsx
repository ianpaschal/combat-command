import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import { Root as PortalRoot } from '@radix-ui/react-portal';
import clsx from 'clsx';

import { IconButton } from '~/components/generic/IconButton';

import './FloatingActionButton.scss';

type FloatingActionButtonRef = ElementRef<typeof IconButton>;
type FloatingActionButtonProps = ComponentPropsWithoutRef<typeof IconButton>;
export const FloatingActionButton = forwardRef<FloatingActionButtonRef, FloatingActionButtonProps>(({
  children,
  className,
  size = 'large',
  variant = 'solid',
  ...props
}, ref): JSX.Element => (
  <PortalRoot asChild>
    <IconButton
      ref={ref}
      className={clsx('FloatingActionButton', className)}
      size={size}
      variant={variant}
      round
      {...props}
    >
      {children}
    </IconButton>
  </PortalRoot>
));