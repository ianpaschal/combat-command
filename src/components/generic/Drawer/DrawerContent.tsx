import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import {
  Content,
  Overlay,
  Portal,
} from '@radix-ui/react-dialog';
import clsx from 'clsx';

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
      {children}
      {/* <Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Close> */}
    </Content>
  </Portal>
));
