import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import clsx from 'clsx';
import { Switch as RadixSwitch } from 'radix-ui';

import { createCn } from '~/utils/componentLib/createCn';

import './Switch.scss';

const cn = createCn('Switch');

type SwitchRef = ElementRef<typeof RadixSwitch.Root>;
type SwitchProps = ComponentPropsWithoutRef<typeof RadixSwitch.Root>;

export const Switch = forwardRef<SwitchRef, SwitchProps>(({
  className,
  disabled,
  ...props
}, ref) => (
  <RadixSwitch.Root ref={ref} className={clsx(cn(), { [cn('-disabled')]: disabled }, className)} disabled={disabled} {...props}>
    <RadixSwitch.Thumb className={cn('_Thumb')} />
  </RadixSwitch.Root>
));
Switch.displayName = cn();
