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
