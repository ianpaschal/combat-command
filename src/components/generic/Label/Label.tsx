import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import clsx from 'clsx';
import { Label as RadixLabel } from 'radix-ui';

import './Label.scss';

type LabelRef = ElementRef<typeof RadixLabel.Root>;
type LabelProps = ComponentPropsWithoutRef<typeof RadixLabel.Root>;
export const Label = forwardRef<LabelRef, LabelProps>(({
  className,
  children,
  ...props
}, ref) => (
  <RadixLabel.Root ref={ref} className={clsx('Label', className)} {...props}>
    {children}
  </RadixLabel.Root>
));
