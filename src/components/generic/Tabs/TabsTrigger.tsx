import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import clsx from 'clsx';
import { Tabs } from 'radix-ui';

import { ElementSize } from '~/types/componentLib';

import './TabsTrigger.scss';

type TabsTriggerRef = ElementRef<typeof Tabs.Trigger>;
type TabsTriggerProps = ComponentPropsWithoutRef<typeof Tabs.Trigger> & {
  size: ElementSize;
};
export const TabsTrigger = forwardRef<TabsTriggerRef, TabsTriggerProps>(({
  className,
  size = 'normal',
  ...props
}, ref): JSX.Element => (
  <Tabs.Trigger ref={ref} className={clsx('TabsTrigger', className)} data-size={size} {...props} />
));
