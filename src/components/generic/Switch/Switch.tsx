import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import { Root, Thumb } from '@radix-ui/react-switch';
import clsx from 'clsx';

import { createCn } from '~/utils/componentLib/createCn';

import './Switch.scss';

const cn = createCn('Switch');

type SwitchRef = ElementRef<typeof Root>;
type SwitchProps = ComponentPropsWithoutRef<typeof Root>;
export const Switch = forwardRef<SwitchRef, SwitchProps>(({
  className,
  disabled,
  ...props
}, ref) => (
  <Root ref={ref} className={clsx(cn(), { [cn('--disabled')]: disabled }, className)} {...props}>
    <Thumb className={cn('__Thumb')} />
  </Root>
));
Switch.displayName = cn();