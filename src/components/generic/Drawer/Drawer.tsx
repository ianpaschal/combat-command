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
import clsx from 'clsx';
import { X } from 'lucide-react';

import { Button, ButtonProps } from '~/components/generic/Button';
import { ScrollArea } from '~/components/generic/ScrollArea';

import styles from './Drawer.module.scss';

export interface DrawerProps extends ComponentPropsWithoutRef<typeof Root> {
  children: ReactNode;
  trigger?: ReactNode;
  side: 'left' | 'right' | 'top' | 'bottom';
  rounded?: boolean; // TODO: Maybe remove... Pick a style and that's enough.

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
  description,
  footer,
  header,
  rounded,
  side,
  title,
  trigger,
  ...props
}: DrawerProps): JSX.Element => (
  <Root {...props}>
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
    </Portal>
  </Root>
);

//  import {
//   ComponentPropsWithoutRef,
//   ElementRef,
//   forwardRef,
// } from 'react';
// import {
//   Close,
//   Content,
//   Overlay,
//   Portal,
// } from '@radix-ui/react-dialog';
// import clsx from 'clsx';
// import { X } from 'lucide-react';

// import './DrawerContent.scss';

// export interface DrawerContentProps extends ComponentPropsWithoutRef<typeof Content> {
//   side: 'left' | 'right' | 'top' | 'bottom';
//   rounded?: boolean;
// }

// export const DrawerContent = forwardRef<ElementRef<typeof Content>, DrawerContentProps>(({
//   side = 'right',
//   className,
//   children,
//   rounded = true,
//   ...props
// }, ref): JSX.Element => (
//   <Portal>
//     <Overlay className="DrawerOverlay" />

//   </Portal>
// ));
