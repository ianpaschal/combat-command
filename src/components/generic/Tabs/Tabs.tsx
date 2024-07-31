import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import {
  Content,
  List,
  Trigger,
} from '@radix-ui/react-tabs';
import clsx from 'clsx';

import './Tabs.scss';

type TabsListRef = ElementRef<typeof List>;
type TabsListProps = ComponentPropsWithoutRef<typeof List>;
const TabsList = forwardRef<TabsListRef, TabsListProps>(({
  className,
  ...props
}, ref): JSX.Element => (
  <List ref={ref} className={clsx('TabsList', className)} {...props} />
));

type TabsTriggerRef = ElementRef<typeof Trigger>;
type TabsTriggerProps = ComponentPropsWithoutRef<typeof Trigger>;
const TabsTrigger = forwardRef<TabsTriggerRef, TabsTriggerProps>(({
  className,
  ...props
}, ref): JSX.Element => (
  <Trigger ref={ref} className={clsx('TabsTrigger', className)} {...props} />
));

type TabsContentRef = ElementRef<typeof Content>;
type TabsContentProps = ComponentPropsWithoutRef<typeof Content>;
const TabsContent = forwardRef<TabsContentRef, TabsContentProps>(({
  className,
  ...props
}, ref): JSX.Element => (
  <Content ref={ref} className={clsx('TabsContent', className)} {...props} />
));

export {
  TabsContent,
  TabsList,
  TabsTrigger,
};