import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import { Trigger } from '@radix-ui/react-tabs';
import clsx from 'clsx';

import { ElementSize } from '~/types/componentLib';

import './TabsTrigger.scss';

type TabsTriggerRef = ElementRef<typeof Trigger>;
type TabsTriggerProps = ComponentPropsWithoutRef<typeof Trigger> & {
  size: ElementSize;
};
export const TabsTrigger = forwardRef<TabsTriggerRef, TabsTriggerProps>(({
  className,
  size = 'normal',
  ...props
}, ref): JSX.Element => (
  <Trigger ref={ref} className={clsx('TabsTrigger', className)} data-size={size} {...props} />
));
