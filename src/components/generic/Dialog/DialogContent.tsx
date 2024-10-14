import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import {
  Close,
  Content,
  Overlay,
  Portal,
} from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { X } from 'lucide-react';

import styles from './DialogContent.module.scss';

export interface DialogContentProps extends ComponentPropsWithoutRef<typeof Content> {
  title?: string;
  description?: string;
}

export const DialogContent = forwardRef<ElementRef<typeof Content>, DialogContentProps>(({
  className,
  children,
  ...props
}, ref): JSX.Element => (
  <Portal>
    <Overlay className={styles.Overlay} />
    <div className={styles.Positioner}>
      <Content className={clsx(styles.Content, className)} ref={ref} {...props}>
        <Close className={clsx(styles.Close)}>
          <X />
        </Close>
        {children}
      </Content>
    </div>
  </Portal>
));
