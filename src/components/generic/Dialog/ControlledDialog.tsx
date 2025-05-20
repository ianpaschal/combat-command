import { MouseEvent, ReactNode } from 'react';
import {
  Close,
  Content,
  Overlay,
  Portal,
  Root,
} from '@radix-ui/react-dialog';
import clsx from 'clsx';
import {
  AnimatePresence,
  HTMLMotionProps,
  motion,
} from 'framer-motion';
import { X } from 'lucide-react';

import { closeModal, useModalVisible } from '~/modals';

import styles from './Dialog.module.scss';

const animationProps: HTMLMotionProps<'div'> = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { ease: 'easeInOut', duration: 0.15 },
};

export interface ControlledDialogProps {
  id: string;
  canCancel?: boolean;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onCancel?: () => void;
  onCloseComplete?: () => void;
  width?: 'small' | 'normal' | 'large';
}

export const ControlledDialog = ({
  id,
  canCancel = true,
  children,
  className,
  disabled = false,
  onCancel,
  onCloseComplete,
  width = 'normal',
}: ControlledDialogProps): JSX.Element => {
  const open = useModalVisible(id);
  const handleCancel = () => {
    if (disabled) {
      return;
    }
    if (onCancel) {
      onCancel();
    }
    closeModal(id);
  };
  const handleCloseComplete = () => {
    if (onCloseComplete) {
      onCloseComplete();
    }
  };
  const handleInteractOutside = (e: Event | MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!canCancel || disabled) {
      e.preventDefault();
    }
    handleCancel();
  };
  return (
    <Root open={open}>
      <AnimatePresence onExitComplete={handleCloseComplete}>
        {open && (
          <Portal forceMount>
            <Overlay forceMount className={styles.Overlay} onClick={handleInteractOutside} />
            <div className={styles.Positioner} tabIndex={-1}>
              <Content
                className={clsx(styles.Content, className, { [styles[`Content-${width}`]]: true })}
                aria-describedby={undefined}
                tabIndex={-1}
                asChild
                forceMount
              >
                <motion.div {...animationProps}>
                  {children}
                  {canCancel && (
                    <Close className={styles.Close} onClick={handleCancel}>
                      <X />
                    </Close>
                  )}
                </motion.div>
              </Content>
            </div>
          </Portal>
        )}
      </AnimatePresence>
    </Root>
  );
};
