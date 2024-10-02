import {
  ElementRef,
  RefObject,
  UIEventHandler,
  useRef,
  useState,
} from 'react';
import { Viewport } from '@radix-ui/react-scroll-area';

type OnScrollHandler = UIEventHandler<HTMLDivElement>;

type IndicatorProps = {
  visible: boolean;
  bordered: boolean;
};

interface FourSidedState {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
}

interface IndicatorConfig {
  top?: IndicatorProps;
  bottom?: IndicatorProps;
  left?: IndicatorProps;
  right?: IndicatorProps;
}

type UseScrollIndicatorsReturn = [
  RefObject<HTMLDivElement>,
  OnScrollHandler,
  IndicatorConfig,
];

export const useScrollIndicators = (indicatorBorder?: string | string[]): UseScrollIndicatorsReturn => {
  const ref = useRef<ElementRef<typeof Viewport>>(null);
  const [visible, setVisible] = useState<FourSidedState>({
    top: false,
    bottom: false,
    left: false,
    right: false,
  });

  const getIndicatorBorders = (): FourSidedState => {
    const defaultState = { top: false,bottom: false,left: false,right: false };
    if (indicatorBorder) {
      if (Array.isArray(indicatorBorder)) {
        return indicatorBorder.reduce((acc, value) => ({
          ...acc,
          [value]: true,
        }), defaultState);
      } else {
        return { ...defaultState, [indicatorBorder]: true };
      }
    } else {
      return defaultState;
    }
  };

  const bordered = getIndicatorBorders();

  const onScroll = (): void => {
    if (!ref.current) {
      return;
    }
    const { width, height } = ref.current.getBoundingClientRect();
    const { scrollTop, scrollLeft, scrollHeight, scrollWidth } = ref.current;
    setVisible({
      top: scrollTop > 0,
      bottom: scrollTop + height < scrollHeight,
      left: scrollLeft > 0,
      right: scrollLeft + width < scrollWidth,
    });
  };

  return [
    ref,
    onScroll,
    {
      top: { visible: visible.top, bordered: bordered.top },
      bottom: { visible: visible.bottom, bordered: bordered.bottom },
      left: { visible: visible.left, bordered: bordered.left },
      right: { visible: visible.right, bordered: bordered.right },
    },
  ];
};