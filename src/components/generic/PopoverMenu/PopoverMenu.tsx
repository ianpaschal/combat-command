import { ReactNode } from 'react';
import {
  Close,
  Content,
  Root,
  Trigger,
} from '@radix-ui/react-popover';

import { Button } from '~/components/generic/Button';

import styles from './PopoverMenu.module.scss';

export interface PopoverMenuProps {
  className?: string;
  children: ReactNode;
  menuItems: {
    icon?: JSX.Element;
    label: string;
    onClick: () => void;
  }[];
}

export const PopoverMenu = ({
  className,
  children,
  menuItems = [],
}: PopoverMenuProps): JSX.Element => (
  <Root >
    <Trigger className={className} asChild>
      {children}
    </Trigger>
    <Content className={styles.PopoverContent} align="end">
      {menuItems.map((menuItem, i) => (
        <Close key={i} asChild>
          <Button variant="ghost" onClick={menuItem.onClick} className={styles.MenuItemButton}>
            {menuItem.icon}{menuItem.label}
          </Button>
        </Close>
      ))}
    </Content>
  </Root>
);
