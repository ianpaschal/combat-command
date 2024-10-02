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

import { useScrollIndicators } from '~/components/generic/ScrollArea/ScrollArea.hooks';
import { bem } from '~/utils/componentLib/bem';

import './ScrollArea.scss';

const cn = bem('ScrollArea');

type ScrollAreaRef = ElementRef<typeof Root>;

type ScrollAreaProps = ComponentPropsWithoutRef<typeof Root> & {
  indicatorBorder?: string | string[];
};

export const ScrollArea = forwardRef<ScrollAreaRef, ScrollAreaProps>(({
  className,
  children,
  indicatorBorder,
  ...props
}, ref) => {
  const [viewportRef, onScroll, indicatorProps] = useScrollIndicators(indicatorBorder);
  // const viewportRef = useRef<ElementRef<typeof Viewport>>(null);
  // const [isTopHidden, setIsTopHidden] = useState<boolean>(false);
  // const [isBottomHidden, setIsBottomHidden] = useState<boolean>(true);
  // const [isLeftHidden, setIsLeftHidden] = useState<boolean>(false);
  // const [isRightHidden, setIsRightHidden] = useState<boolean>(true);
  // // FIXME: Is this needed? I don't think so, but maybe if the refs start misbehaving...
  // // useImperativeHandle(ref, () => viewportRef.current!, []);

  // const getIndicatorBorders = (): { top?: boolean, bottom?: boolean, left?: boolean, right?: boolean, } => {
  //   if (indicatorBorder) {
  //     if (Array.isArray(indicatorBorder)) {
  //       return indicatorBorder.reduce((acc, value) => ({
  //         ...acc,
  //         [value]: true,
  //       }), {});
  //     } else {
  //       return { [indicatorBorder]: true };
  //     }
  //   }
  //   return {};
  // };

  // const borders = getIndicatorBorders();

  // const handleScroll = (): void => {
  //   if (!viewportRef.current) {
  //     return;
  //   }
  //   const { width, height } = viewportRef.current.getBoundingClientRect();
  //   const { scrollTop, scrollLeft, scrollHeight, scrollWidth } = viewportRef.current;
  //   if (scrollTop > 0) {
  //     setIsTopHidden(true);
  //   } else {
  //     setIsTopHidden(false);
  //   }
  //   if (scrollTop + height < scrollHeight) {
  //     setIsBottomHidden(true);
  //   } else {
  //     setIsBottomHidden(false);
  //   }
  //   if (scrollLeft > 0) {
  //     setIsLeftHidden(true);
  //   } else {
  //     setIsLeftHidden(false);
  //   }
  //   if (scrollLeft + width < scrollWidth) {
  //     setIsRightHidden(true);
  //   } else {
  //     setIsRightHidden(false);
  //   }
  // };
  return (
    <Root className={clsx(cn('Root'), className)} ref={ref} type="scroll" scrollHideDelay={1000} {...props}>
      <Viewport className={cn('Viewport')} ref={viewportRef} onScroll={onScroll}>
        {children}
      </Viewport>
      <div className={cn('IndicatorTop', indicatorProps.top)} />
      <div className={cn('IndicatorBottom', indicatorProps.bottom)} />
      <div className={cn('IndicatorLeft', indicatorProps.left)} />
      <div className={cn('IndicatorRight', indicatorProps.right)} />
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

