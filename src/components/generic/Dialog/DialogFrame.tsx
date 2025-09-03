import {
  ComponentPropsWithoutRef,
  MouseEvent,
  ReactNode,
} from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Dialog } from 'radix-ui';

import styles from './Dialog.module.scss';

export interface DialogFrameProps extends ComponentPropsWithoutRef<typeof Dialog.Root> {
  children?: ReactNode;
  trigger?: ReactNode;
  width?: 'small' | 'normal' | 'large';
  maxHeight?: number;
  height?: number;
  preventCancel?: boolean;
  onCancel?: () => void;
  title: string;
  className?: string;
  onCloseComplete?: () => void;
}

export const DialogFrame = ({
  children,
  className,
  width = 'normal',
  trigger,
  maxHeight,
  height,
  onCancel,
  preventCancel = false,
  title,
  open,
  onOpenChange,
  onCloseComplete,
  ...props
}: DialogFrameProps): JSX.Element => {
  const handleCancel = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if (onOpenChange) {
      onOpenChange(false);
    }
    if (onCancel) {
      onCancel;
    }
  };
  const handleInteractOutside = (): void => {
    if (onOpenChange) {
      onOpenChange(false);
    }
    if (onCancel) {
      onCancel;
    }
  };
  const handleCloseComplete = () => {
    if (onCloseComplete) {
      onCloseComplete();
    }
  };
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} {...props}>
      {trigger && (
        <Dialog.Trigger asChild>
          {trigger}
        </Dialog.Trigger>
      )}
      <AnimatePresence onExitComplete={handleCloseComplete}>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay forceMount className={styles.Overlay} onClick={!preventCancel && onCancel ? onCancel : undefined} />
            <div className={styles.Positioner} tabIndex={-1}>

              <Dialog.Content
                className={clsx(styles.Content, className, { [styles[`Content-${width}`]]: true })}
                style={{
                  maxHeight: height && maxHeight ? Math.max(height, maxHeight) : maxHeight,
                  height: height && maxHeight ? Math.max(height, maxHeight) : height,
                }}
                aria-describedby={undefined}
                onInteractOutside={handleInteractOutside}
                tabIndex={-1}
                asChild
                forceMount
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ ease: 'easeInOut', duration: 0.15 }}
                >
                  <div className={styles.Header}>
                    <Dialog.Title>
                      {title}
                    </Dialog.Title>
                    {!preventCancel && (
                      <Dialog.Close className={styles.Close} onClick={handleCancel}>
                        <X />
                      </Dialog.Close>
                    )}
                  </div>
                  {children}
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};
