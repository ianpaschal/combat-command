import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import { List } from '@radix-ui/react-tabs';
import clsx from 'clsx';

import styles from './TabsList.module.scss';

type TabsListRef = ElementRef<typeof List>;
type TabsListProps = ComponentPropsWithoutRef<typeof List> & { width?: 'max' | 'min' };
export const TabsList = forwardRef<TabsListRef, TabsListProps>(({
  className,
  width = 'max',
  ...props
}, ref): JSX.Element => (
  <List ref={ref} className={clsx('TabsList', styles.Root, styles[`Root-${width}`], className)} {...props} />
));
