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
type SwitchProps = ComponentPropsWithoutRef<typeof Root> & {
  hasError?: boolean;
};
export const Switch = forwardRef<SwitchRef, SwitchProps>(({
  className,
  disabled,
  hasError = false,
  ...props
}, ref) => (
  <Root ref={ref} className={clsx(cn(), { [cn('-disabled')]: disabled, [cn('-hasError')]: hasError }, className)} disabled={disabled} {...props}>
    <Thumb className={cn('_Thumb')} />
  </Root>
));
Switch.displayName = cn();
