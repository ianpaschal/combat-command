import { ReactNode, useState } from 'react';
import clsx from 'clsx';
import { Popover } from 'radix-ui';

import styles from './InfoPopover.module.scss';

export interface InfoPopoverProps {
  autoHideDuration?: number;
  children: ReactNode;
  className?: string;
  content: string;
  disableAutoHide?: boolean;
  orientation?: 'vertical' | 'horizontal';
}

export const InfoPopover = ({
  autoHideDuration = 2000,
  children,
  className,
  content,
  disableAutoHide = false,
  orientation = 'vertical',
}: InfoPopoverProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (open && !disableAutoHide) {
      setTimeout(() => {
        setOpen(false);
      }, autoHideDuration);
    }
  };
  return (
    <Popover.Root onOpenChange={handleOpenChange} open={open}>
      <Popover.Trigger className={clsx(styles.InfoPopover, className)} asChild>
        {children}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className={styles.InfoPopover_Content} sideOffset={2} side={orientation === 'vertical' ? 'top' : 'left'} align="center">
          {content}
          <Popover.Arrow className={styles.InfoPopover_Arrow} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root >
  );
};
