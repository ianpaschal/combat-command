import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import { Content } from '@radix-ui/react-tabs';
import clsx from 'clsx';

import styles from './TabsContent.module.scss';

type TabsContentRef = ElementRef<typeof Content>;
type TabsContentProps = ComponentPropsWithoutRef<typeof Content>;
export const TabsContent = forwardRef<TabsContentRef, TabsContentProps>(({
  className,
  ...props
}, ref): JSX.Element => (
  <Content ref={ref} className={clsx('TabsContent', styles.Root, className)} {...props} tabIndex={-1} />
));
