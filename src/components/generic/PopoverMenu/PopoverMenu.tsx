import {
  MouseEvent,
  ReactNode,
  useState,
} from 'react';
import { Popover } from 'radix-ui';

import styles from './PopoverMenu.module.scss';

export interface PopoverMenuProps {
  className?: string;
  children: ReactNode;
  menuItems: {
    icon?: JSX.Element;
    label: string;
    onClick: (e: MouseEvent) => void;
  }[];
}

export const PopoverMenu = ({
  className,
  children,
  menuItems = [],
}: PopoverMenuProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className={className} asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </Popover.Trigger>
      <Popover.Content className={styles.PopoverContent} align="end">
        {menuItems.map((menuItem, i) => (
          <Popover.Close key={i} asChild>
            <div
              onClick={(e) => {
                e.stopPropagation();
                menuItem.onClick(e);
              }}
              className={styles.MenuItem}
            >
              {menuItem.icon}{menuItem.label}
            </div>
          </Popover.Close>
        ))}
      </Popover.Content>
    </Popover.Root>
  );
};
