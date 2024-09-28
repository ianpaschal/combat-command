import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  LegacyRef,
  MutableRefObject,
  RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Corner,
  Root,
  Scrollbar,
  Thumb,
  Viewport,
} from '@radix-ui/react-scroll-area';
import clsx from 'clsx';

import { bem } from '~/utils/componentLib/bem';

import './ScrollArea.scss';

const cn = bem('ScrollArea');

type ScrollAreaRef = ElementRef<typeof Root>;

type ScrollAreaProps = ComponentPropsWithoutRef<typeof Root> & {
  addIndicatorBorder?: boolean;
};

export const ScrollArea = forwardRef<ScrollAreaRef, ScrollAreaProps>(({
  className,
  children,
  addIndicatorBorder = false,
  ...props
}, ref) => {
  const viewportRef = useRef<ElementRef<typeof Viewport>>(null);
  const [isTopHidden, setIsTopHidden] = useState<boolean>(false);
  const [isBottomHidden, setIsBottomHidden] = useState<boolean>(true);
  const [isLeftHidden, setIsLeftHidden] = useState<boolean>(false);
  const [isRightHidden, setIsRightHidden] = useState<boolean>(true);
  // FIXME: Is this needed? I don't think so, but maybe if the refs start misbehaving...
  // useImperativeHandle(ref, () => viewportRef.current!, []);
  const handleScroll = (): void => {
    if (!viewportRef.current) {
      return;
    }
    const height = viewportRef.current.clientHeight;
    const width = viewportRef.current.clientWidth;
    const yScroll = viewportRef.current.scrollTop;
    const xScroll = viewportRef.current.scrollLeft;
    if (yScroll > 0) {
      setIsTopHidden(true);
    } else {
      setIsTopHidden(false);
    }
    if (yScroll < height) {
      setIsBottomHidden(true);
    } else {
      setIsBottomHidden(false);
    }
    if (xScroll > 0) {
      setIsLeftHidden(true);
    } else {
      setIsLeftHidden(false);
    }
    if (xScroll < width) {
      setIsRightHidden(true);
    } else {
      setIsRightHidden(false);
    }
  };
  console.log(isTopHidden);
  return (
    <Root className={clsx(cn('Root'), className)} ref={ref} type="scroll" scrollHideDelay={1000} {...props}>
      <Viewport className={cn('Viewport')} ref={viewportRef} onScroll={handleScroll}>
        {children}
      </Viewport>
      <div className={cn('IndicatorTop', { visible: isTopHidden, addBorder: addIndicatorBorder })} />
      <div className={cn('IndicatorBottom', { visible: isBottomHidden, addBorder: addIndicatorBorder })} />
      <div className={cn('IndicatorLeft', { visible: isLeftHidden, addBorder: addIndicatorBorder })} />
      <div className={cn('IndicatorRight', { visible: isRightHidden, addBorder: addIndicatorBorder })} />
      <Scrollbar className={cn('Scrollbar')} orientation="vertical">
        <Thumb className={cn('Thumb')} />
      </Scrollbar>
      <Scrollbar className={cn('Scrollbar')} orientation="horizontal">
        <Thumb className={cn('Thumb')} />
      </Scrollbar>
      <Corner className={cn('Corner')} />
    </Root>
  );
});

