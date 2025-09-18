import {
  ComponentPropsWithoutRef,
  CSSProperties,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { Dialog } from 'radix-ui';

import { Button, ButtonProps } from '~/components/generic/Button';

import styles from './Drawer.module.scss';

export interface DrawerProps extends ComponentPropsWithoutRef<typeof Dialog.Root> {
  children: ReactNode;
  trigger?: ReactNode;
  side: 'left' | 'right' | 'top' | 'bottom';
  rounded?: boolean; // TODO: Maybe remove... Pick a style and that's enough.
  closeOnRouteChange?: boolean;
  size?: CSSProperties['width'];

  // Standard elements
  title?: string;
  description?: string;
  actions?: ({ label: string; } & ButtonProps)[];

  // Custom elements
  header?: ReactNode;
  footer?: ReactNode;
}

export const Drawer = ({
  actions,
  children,
  closeOnRouteChange = true,
  description,
  footer,
  size,
  header,
  rounded,
  side,
  title,
  trigger,
  ...props
}: DrawerProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const location = useLocation();
  useEffect(() => {
    if (closeOnRouteChange) {
      setOpen(false);
    }
  }, [closeOnRouteChange, location.pathname]);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen} {...props}>
      {trigger && (
        <Dialog.Trigger asChild>
          {trigger}
        </Dialog.Trigger>
      )}
      <Dialog.Portal>
        <Dialog.Overlay className={styles.Overlay} />
        <Dialog.Content
          className={clsx(
            styles.Content,
            styles[`Content-${side}`],
            { [`DrawerContent-${side}-rounded`]: rounded },
          )}
          style={['top', 'bottom'].includes(side) ? { height: size } : { width: size }}
        >
          <Dialog.Close className={styles.Close}>
            <X />
          </Dialog.Close>
          {title && (
            <div className={styles.Header}>
              <Dialog.Title>
                {title}
              </Dialog.Title>
            </div>
          )}
          {header}
          <div className={styles.Inner}>
            {description && (
              <Dialog.Description className={styles.Description}>
                {description}
              </Dialog.Description>
            )}
            {children}
          </div>
          {footer}
          {actions?.length && (
            <div className={styles.Footer}>
              {actions.map(({ label, ...itemProps }, i) => (
                <Button key={i} text={label} {...itemProps} />
              ))}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
