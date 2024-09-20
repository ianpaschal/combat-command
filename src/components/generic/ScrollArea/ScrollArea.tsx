import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import {
  Corner,
  Root,
  Scrollbar,
  Thumb,
  Viewport,
} from '@radix-ui/react-scroll-area';
import clsx from 'clsx';

import './ScrollArea.scss';

type ScrollAreaRef = ElementRef<typeof Root>;
type ScrollAreaProps = ComponentPropsWithoutRef<typeof Root>;
export const ScrollArea = forwardRef<ScrollAreaRef, ScrollAreaProps>(({
  className,
  children,
  ...props
}, ref) => (
  <Root className={clsx('ScrollAreaRoot', className)} ref={ref} type="scroll" scrollHideDelay={1000} {...props}>
    <Viewport className="ScrollAreaViewport">
      {children}
    </Viewport>
    <Scrollbar className="ScrollAreaScrollbar" orientation="vertical">
      <Thumb className="ScrollAreaThumb" />
    </Scrollbar>
    <Scrollbar className="ScrollAreaScrollbar" orientation="horizontal">
      <Thumb className="ScrollAreaThumb" />
    </Scrollbar>
    <Corner className="ScrollAreaCorner" />
  </Root>
));

