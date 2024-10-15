import { ComponentPropsWithoutRef, ReactNode } from 'react';
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
import { X } from 'lucide-react';

import { Button, ButtonProps } from '~/components/generic/Button';

import styles from './Dialog.module.scss';

export interface DialogProps extends ComponentPropsWithoutRef<typeof Root> {
  children: ReactNode;
  trigger?: ReactNode;
  maxWidth?: number;
  maxHeight?: number;
  height?: number;

  // Standard elements
  title?: string;
  description?: string;
  actions?: ({ label: string; } & ButtonProps)[];

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
  ...props
}: DialogProps): JSX.Element => (
  <Root {...props}>
    {trigger && (
      <Trigger asChild>
        {trigger}
      </Trigger>
    )}
    <Portal>
      <Overlay className={styles.Overlay} />
      <div className={styles.Positioner}>
        <Content
          className={styles.Content}
          style={{
            maxWidth,
            maxHeight: height && maxHeight ? Math.max(height, maxHeight) : maxHeight,
            height: height && maxHeight ? Math.max(height, maxHeight) : height,
          }}
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
      </div>
    </Portal>
  </Root>
);