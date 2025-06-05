import {
  ElementRef,
  RefObject,
  UIEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Viewport } from '@radix-ui/react-scroll-area';

type OnScrollHandler = UIEventHandler<HTMLDivElement>;

type IndicatorProps = {
  visible: boolean;
  bordered: boolean;
};

export interface FourSidedState {
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
    const defaultState = { top: false, bottom: false, left: false, right: false };
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

  const updateIndicatorVisibility = () => {
    if (!ref.current) {
      return;
    }

    // Viewport size
    const { width, height } = ref.current.getBoundingClientRect();

    // Scroll content offset and size
    const { scrollTop, scrollLeft, scrollHeight, scrollWidth } = ref.current;

    // If the difference between the height and scrollHeight is less than 1px, the browser doesn't allow scrolling anyway.
    setVisible({
      top: scrollTop > 0,
      bottom: scrollHeight - scrollTop > height,
      left: scrollLeft > 0,
      right:  (scrollWidth - width > 1) && (scrollLeft + width < scrollWidth),
    });
  };

  // Set initial visibility
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const observer = new ResizeObserver(() => {
      updateIndicatorVisibility();
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [
    ref,
    updateIndicatorVisibility,
    {
      top: { visible: visible.top, bordered: bordered.top },
      bottom: { visible: visible.bottom, bordered: bordered.bottom },
      left: { visible: visible.left, bordered: bordered.left },
      right: { visible: visible.right, bordered: bordered.right },
    },
  ];
};
