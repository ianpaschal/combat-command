import {
  ComponentPropsWithoutRef,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
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
import { X } from 'lucide-react';

import { Button, ButtonProps } from '~/components/generic/Button';

import styles from './Drawer.module.scss';

export interface DrawerProps extends ComponentPropsWithoutRef<typeof Root> {
  children: ReactNode;
  trigger?: ReactNode;
  side: 'left' | 'right' | 'top' | 'bottom';
  rounded?: boolean; // TODO: Maybe remove... Pick a style and that's enough.
  closeOnRouteChange?: boolean;

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
    <Root open={open} onOpenChange={setOpen} {...props}>
      {trigger && (
        <Trigger asChild>
          {trigger}
        </Trigger>
      )}
      <Portal>
        <Overlay className={styles.Overlay} />
        <Content
          className={clsx(
            styles.Content,
            styles[`Content-${side}`],
            { [`DrawerContent-${side}-rounded`]: rounded },
          )}
        >
          <Close className={styles.Close}>
            <X />
          </Close>
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
              {actions.map(({ label, ...itemProps }, i) => (
                <Button key={i} {...itemProps}>
                  {label}
                </Button>
              ))}
            </div>
          )}
        </Content>
      </Portal>
    </Root>
  );
};