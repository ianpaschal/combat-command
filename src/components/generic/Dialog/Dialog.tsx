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
import { ScrollArea } from '~/components/generic/ScrollArea';

import styles from './Dialog.module.scss';

export interface DialogProps extends ComponentPropsWithoutRef<typeof Root> {
  children: ReactNode;
  trigger?: ReactNode;

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
        <Content className={styles.Content}>
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
          <ScrollArea
            type="scroll"
            indicatorBorder={[
              ...(title || header ? ['top'] : []),
              ...(footer || actions?.length ? ['bottom'] : []),
            ]}
          >
            <div className={styles.Inner}>
              {description && (
                <Description className={styles.Description}>
                  {description}
                </Description>
              )}
              {children}
            </div>
          </ScrollArea>
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