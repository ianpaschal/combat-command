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
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

import { Button, ButtonProps } from '~/components/generic/Button';

import styles from './Dialog.module.scss';

export interface DialogProps extends ComponentPropsWithoutRef<typeof Root> {
  children?: ReactNode;
  trigger?: ReactNode;
  maxWidth?: number;
  maxHeight?: number;
  height?: number;

  // Standard elements
  title?: string;
  description?: string;
  actions?: ({ label: string; cancel?: boolean; } & ButtonProps)[];

  // Custom elements
  header?: ReactNode;
  footer?: ReactNode;
}

export const Dialog = ({
  actions,
  children,
  maxWidth,
  maxHeight,
  height,
  description,
  footer,
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
            <Overlay className={styles.Overlay} />
            <div className={styles.Positioner}>
              <Content
                className={styles.Content}
                style={{
                  maxWidth,
                  maxHeight: height && maxHeight ? Math.max(height, maxHeight) : maxHeight,
                  height: height && maxHeight ? Math.max(height, maxHeight) : height,
                }}
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
                      {actions.map(({ label, cancel, ...itemProps }, i) => {
                        if (cancel) {
                          return (
                            <Close key={i} asChild>
                              <Button {...itemProps}>
                                {label}
                              </Button>
                            </Close>
                          );
                        }
                        return (
                          <Button key={i} {...itemProps}>
                            {label}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                  <Close className={styles.Close}>
                    <X />
                  </Close>
                </motion.div>
              </Content>
            </div>
          </Portal>
        )}
      </AnimatePresence>
    </Root>
  );
};