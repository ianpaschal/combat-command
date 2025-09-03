import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import clsx from 'clsx';
import { Tabs } from 'radix-ui';

import styles from './TabsContent.module.scss';

type TabsContentRef = ElementRef<typeof Tabs.Content>;
type TabsContentProps = ComponentPropsWithoutRef<typeof Tabs.Content>;
export const TabsContent = forwardRef<TabsContentRef, TabsContentProps>(({
  className,
  ...props
}, ref): JSX.Element => (
  <Tabs.Content ref={ref} className={clsx('TabsContent', styles.Root, className)} {...props} tabIndex={-1} />
));
