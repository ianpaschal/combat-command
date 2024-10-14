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

import './DrawerContent.scss';

export interface DrawerContentProps extends ComponentPropsWithoutRef<typeof Content> {
  side: 'left' | 'right' | 'top' | 'bottom';
  rounded?: boolean;
}

export const DrawerContent = forwardRef<ElementRef<typeof Content>, DrawerContentProps>(({
  side = 'right',
  className,
  children,
  rounded = true,
  ...props
}, ref): JSX.Element => (
  <Portal>
    <Overlay className="DrawerOverlay" />
    <Content
      ref={ref}
      aria-describedby={undefined}
      className={clsx(
        'DrawerContent',
        `DrawerContent-${side}`,
        { [`DrawerContent-${side}-rounded`]: rounded },
        className,
      )}
      {...props}
    >
      <Close className={'DrawerClose'}>
        <X />
      </Close>
      {children}
    </Content>
  </Portal>
));
