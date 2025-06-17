import {
  MouseEvent,
  ReactNode,
  useState,
} from 'react';
import {
  Close,
  Content,
  Root,
  Trigger,
} from '@radix-ui/react-popover';

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
    <Root open={open} onOpenChange={setOpen}>
      <Trigger className={className} asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </Trigger>
      <Content className={styles.PopoverContent} align="end">
        {menuItems.map((menuItem, i) => (
          <Close key={i} asChild>
            <div
              onClick={(e) => {
                e.stopPropagation();
                menuItem.onClick(e);
              }}
              className={styles.MenuItem}
            >
              {menuItem.icon}{menuItem.label}
            </div>
          </Close>
        ))}
      </Content>
    </Root>
  );
};
