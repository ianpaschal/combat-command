import {
  ComponentPropsWithoutRef,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Dialog as RadixDialog } from 'radix-ui';

import { Button, ButtonProps } from '~/components/generic/Button';

import styles from './Dialog.module.scss';

export interface DialogProps extends ComponentPropsWithoutRef<typeof RadixDialog.Root> {
  children?: ReactNode;
  trigger?: ReactNode;
  width?: 'small' | 'normal' | 'large';
  maxHeight?: number;
  height?: number;
  preventCancel?: boolean;
  onCancel?: () => void;
  onCloseComplete?: () => void;

  // Standard elements
  title?: string;
  description?: string;
  actions?: ({ label: string; cancel?: boolean; closeOnClick?: boolean } & ButtonProps)[];

  // Custom elements
  header?: ReactNode;
  footer?: ReactNode;
}

export const Dialog = ({
  actions,
  children,
  width = 'normal',
  maxHeight,
  height,
  description,
  footer,
  onCancel,
  preventCancel = false,
  header,
  title,
  trigger,
  open: controlledOpen = false,
  onOpenChange,
  onCloseComplete,
  ...props
}: DialogProps): JSX.Element => {
  /**
   * This nonsense is needed because Framer Motion requires the dialog to be controlled. So we have
   * an internal state for when the dialog is not externally controlled, but which is kept in sync
   * when it is.
   * 
   * Would like to get rid of it. Might dump Framer Motion because it hasn't worked everywhere I
   * hoped. However for Dialogs it's needed to create a "pop" animation using translate scale. With
   * pure CSS, the need to use the translate property for centering the dialog conflicts with
   * animating the translate property.
   */
  const [open, setOpen] = useState<boolean>(controlledOpen);
  const handleOpen = (isOpen: boolean): void => {
    setOpen(isOpen);
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
  };
  useEffect(() => {
    setOpen(controlledOpen);
  }, [controlledOpen]);
  const handleCloseComplete = () => {
    if (onCloseComplete) {
      onCloseComplete();
    }
  };
  return (
    <RadixDialog.Root open={open} onOpenChange={handleOpen} {...props}>
      {trigger && (
        <RadixDialog.Trigger asChild>
          {trigger}
        </RadixDialog.Trigger>
      )}
      <AnimatePresence onExitComplete={handleCloseComplete}>
        {open && (
          <RadixDialog.Portal forceMount>
            <RadixDialog.Overlay forceMount className={styles.Overlay} onClick={!preventCancel && onCancel ? onCancel : undefined} />
            <div className={styles.Positioner} tabIndex={-1}>
              <RadixDialog.Content
                className={clsx(styles.Content, { [styles[`Content-${width}`]]: true })}
                style={{
                  maxHeight: height && maxHeight ? Math.max(height, maxHeight) : maxHeight,
                  height: height && maxHeight ? Math.max(height, maxHeight) : height,
                }}
                aria-describedby={undefined}
                onInteractOutside={(e) => {
                  if (preventCancel) {
                    e.preventDefault();
                  }
                }}
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
                  {title && (
                    <div className={styles.Header}>
                      <RadixDialog.Title>
                        {title}
                      </RadixDialog.Title>
                    </div>
                  )}
                  {header}
                  <div className={styles.Inner}>
                    {description && (
                      <RadixDialog.Description className={styles.Description}>
                        {description}
                      </RadixDialog.Description>
                    )}
                    {children}
                  </div>
                  {footer}
                  {actions?.length && (
                    <div className={styles.Footer}>
                      {actions?.length && actions.map(({ label, cancel, onClick, closeOnClick, ...itemProps }, i) => {
                        const button = (
                          <Button
                            key={i}
                            {...itemProps}
                            text={label}
                            onClick={(e) => {
                              if (cancel && onCancel) {
                                onCancel();
                              }
                              if (onClick) {
                                onClick(e);
                              }
                            }}
                          />
                        );
                        return (cancel || closeOnClick) ? (
                          <RadixDialog.Close key={i} asChild>
                            {button}
                          </RadixDialog.Close>
                        ) : button;
                      })}
                    </div>
                  )}
                  {!preventCancel && (
                    <RadixDialog.Close className={styles.Close} onClick={onCancel}>
                      <X />
                    </RadixDialog.Close>
                  )}
                </motion.div>
              </RadixDialog.Content>
            </div>
          </RadixDialog.Portal>
        )}
      </AnimatePresence>
    </RadixDialog.Root>
  );
};
