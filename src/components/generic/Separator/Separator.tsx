import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import { Root } from '@radix-ui/react-separator';
import clsx from 'clsx';

import './Separator.scss';

type SeparatorRef = ElementRef<typeof Root>;
type SeparatorProps = ComponentPropsWithoutRef<typeof Root>;
export const Separator = forwardRef<SeparatorRef, SeparatorProps>(({
  className,
  ...props
}, ref) => (
  <Root ref={ref} className={clsx('Separator', className)} {...props} />
),
);