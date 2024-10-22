import {
  ComponentPropsWithoutRef,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import {
  Close,
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

import { Button, ButtonProps } from '~/components/generic/Button';

import styles from './Dialog.module.scss';

export interface DialogProps extends ComponentPropsWithoutRef<typeof Root> {
  children?: ReactNode;
  trigger?: ReactNode;
  width?: 'small' | 'normal' | 'large';
  maxHeight?: number;
  height?: number;
  preventCancel?: boolean;
  onCancel?: () => void;

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
  return (
    <Root open={open} onOpenChange={handleOpen} {...props}>
      {trigger && (
        <Trigger asChild>
          {trigger}
        </Trigger>
      )}
      <AnimatePresence>
        {open && (
          <Portal forceMount>
            <Overlay className={styles.Overlay} onClick={onCancel} />
            <div className={styles.Positioner} tabIndex={-1}>
              <Content
                className={clsx(styles.Content, { [styles[`Content-${width}`]]: true })}
                style={{
                  maxHeight: height && maxHeight ? Math.max(height, maxHeight) : maxHeight,
                  height: height && maxHeight ? Math.max(height, maxHeight) : height,
                }}
                aria-describedby={undefined}
                tabIndex={-1}
                asChild
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ ease: 'easeInOut', duration: 0.15 }}
                >
                  {title && (
                    <div className={styles.Header}>
                      <Title>
                        {title}
                      </Title>
                    </div>
                  )}
                  {header}
                  <div className={styles.Inner}>
                    {description && (
                      <Description className={styles.Description}>
                        {description}
                      </Description>
                    )}
                    {children}
                  </div>
                  {footer}
                  {actions?.length && (
                    <div className={styles.Footer}>
                      {actions?.length && actions.map(({ label, cancel, onClick, closeOnClick, ...itemProps }, i) => {
                        const button = (
                          <Button key={i} {...itemProps} onClick={(e) => {
                            if (cancel && onCancel) {
                              onCancel();
                            }
                            if (onClick) {
                              onClick(e);
                            }
                          }}>
                            {label}
                          </Button>
                        );
                        return (cancel || closeOnClick) ? (
                          <Close key={i} asChild>{button}</Close>
                        ) : button;
                      })}
                    </div>
                  )}
                  {!preventCancel && (
                    <Close className={styles.Close} onClick={onCancel}>
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