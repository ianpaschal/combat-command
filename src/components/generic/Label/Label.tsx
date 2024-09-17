import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import { Label as RadixLabel } from '@radix-ui/react-label';
import clsx from 'clsx';

import './Label.scss';

type LabelRef = ElementRef<typeof RadixLabel>;
type LabelProps = ComponentPropsWithoutRef<typeof RadixLabel>;
export const Label = forwardRef<LabelRef, LabelProps>(({
  className,
  children,
  ...props
}, ref) => (
  <RadixLabel ref={ref} className={clsx('Label', className)} {...props}>
    {children}
  </RadixLabel>
));