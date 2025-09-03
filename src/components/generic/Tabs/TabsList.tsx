import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  ReactElement,
} from 'react';
import clsx from 'clsx';
import { Tabs } from 'radix-ui';

import { TabsTrigger } from '~/components/generic/Tabs/TabsTrigger';
import { ElementSize } from '~/types/componentLib';

import styles from './TabsList.module.scss';

type TabDef = {
  icon?: ReactElement;
  label: string;
  value: string;
};

type TabsListRef = ElementRef<typeof Tabs.List>;
type TabsListProps = ComponentPropsWithoutRef<typeof Tabs.List> & {
  width?: 'max' | 'min';
  orientation?: 'horizontal' | 'vertical';
  size?: ElementSize;
  tabs: TabDef[];
  hideLabels?: boolean;
};
export const TabsList = forwardRef<TabsListRef, TabsListProps>(({
  className,
  width = 'max',
  orientation = 'horizontal',
  size = 'normal',
  tabs,
  hideLabels = false,
  ...props
}, ref): JSX.Element => (
  <Tabs.List
    ref={ref}
    className={clsx('TabsList', styles.Root, styles[`Root-${width}`], styles[`Root-${orientation}`], className)}
    {...props}
  >
    {tabs.map(({ value, label, icon }) => (
      <TabsTrigger key={value} value={value} size={size}>
        {icon}
        {!hideLabels && label}
      </TabsTrigger>
    ))}
  </Tabs.List>
));
