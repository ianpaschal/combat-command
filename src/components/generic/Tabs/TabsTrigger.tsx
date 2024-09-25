import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import { Trigger } from '@radix-ui/react-tabs';
import clsx from 'clsx';

import './TabsTrigger.scss';

type TabsTriggerRef = ElementRef<typeof Trigger>;
type TabsTriggerProps = ComponentPropsWithoutRef<typeof Trigger>;
export const TabsTrigger = forwardRef<TabsTriggerRef, TabsTriggerProps>(({
  className,
  ...props
}, ref): JSX.Element => (
  <Trigger ref={ref} className={clsx('TabsTrigger', className)} {...props} />
));

