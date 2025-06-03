import { ReactNode, useState } from 'react';
import {
  Close,
  Content,
  Root,
  Trigger,
} from '@radix-ui/react-popover';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import styles from './InfoPopover.module.scss';

const animationProps = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2 },
};

export interface InfoPopoverProps {
  autoHideDuration?: number;
  children: ReactNode;
  className?: string;
  content: string;
  disableAutoHide?: boolean;
}

export const InfoPopover = ({
  autoHideDuration = 2000,
  children,
  className,
  content,
  disableAutoHide = false,
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
    <Root onOpenChange={handleOpenChange} open={open}>
      <Trigger className={clsx(styles.InfoPopover, className)} asChild>
        {children}
      </Trigger>
      <AnimatePresence>
        {open && (
          <Content asChild className={styles.InfoPopover_Content} align="center" forceMount>
            <motion.div {...animationProps}>
              <Close asChild>
                <span>{content}</span>
              </Close>
            </motion.div>
          </Content>
        )}
      </AnimatePresence>
    </Root>
  );
};
