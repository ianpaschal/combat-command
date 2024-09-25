import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import { Content } from '@radix-ui/react-tabs';
import clsx from 'clsx';

type TabsContentRef = ElementRef<typeof Content>;
type TabsContentProps = ComponentPropsWithoutRef<typeof Content>;
export const TabsContent = forwardRef<TabsContentRef, TabsContentProps>(({
  className,
  ...props
}, ref): JSX.Element => (
  <Content ref={ref} className={clsx('TabsContent', className)} {...props} />
));
