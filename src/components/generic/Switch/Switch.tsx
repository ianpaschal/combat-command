import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import { Root, Thumb } from '@radix-ui/react-switch';
import clsx from 'clsx';

import './Switch.scss';

type SwitchRef = ElementRef<typeof Root>;
type SwitchProps = ComponentPropsWithoutRef<typeof Root>;
export const Switch = forwardRef<SwitchRef, SwitchProps>(({
  className,
  disabled,
  ...props
}, ref) => (
  <Root ref={ref} className={clsx('Switch', { 'Switch-disabled': disabled }, className)} {...props}>
    <Thumb className="SwitchThumb" />
  </Root>
));