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
}: PopoverMenuProps): JSX.Element | null => {
  const [open, setOpen] = useState<boolean>(false);
  if (!menuItems.length) {
    return null;
  }
  const hasIcons = menuItems.some((item) => item.icon);
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
              data-has-icons={hasIcons}
            >
              {menuItem.icon && (
                <span className={styles.MenuItem_Icon}>{menuItem.icon}</span>
              )}
              <span className={styles.MenuItem_Label}>{menuItem.label}</span>
            </div>
          </Popover.Close>
        ))}
      </Popover.Content>
    </Popover.Root>
  );
};
