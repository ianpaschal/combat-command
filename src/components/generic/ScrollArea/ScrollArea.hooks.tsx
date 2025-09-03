import {
  ElementRef,
  ReactElement,
  RefObject,
  UIEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Viewport } from '@radix-ui/react-scroll-area';

import styles from './ScrollArea.module.scss';

/**
 * Type to track the state of an attribute-per-side of a box model.
 */
export interface FourSidedState {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
}

/**
 * Default state for an attribute-per-side of a box model.
 */
const defaultState: FourSidedState = { top: false, bottom: false, left: false, right: false };

/**
 * Gets the visibility for each of a ScrollArea's 4 sides' indicator borders.
 * NOTE: Borders will only render if the overall indicator for that side is visible.
 * @param borders - The side or sides to render a border on.
 * @returns The border visibility state per side.
 */
const getBorderVisibility = (
  borders?: string | string[],
): FourSidedState => {
  if (borders) {
    if (Array.isArray(borders)) {
      return borders.reduce((acc, value) => ({
        ...acc,
        [value]: true,
      }), defaultState);
    } else {
      return { ...defaultState, [borders]: true };
    }
  } else {
    return defaultState;
  }
};

/**
 * Gets the visibility for each of a ScrollArea's 4 sides' indicator.
 * @param ref - The viewport ref object.
 * @returns The visibility state per side.
 */
const getIndicatorVisibility = (
  ref: RefObject<HTMLDivElement>,
): FourSidedState => {
  if (!ref.current) {
    return defaultState;
  }

  // Viewport intrinsic (NOT rendered, .getBoundingClientRect()) size
  const height = ref.current.offsetHeight;
  const width = ref.current.offsetWidth;

  // Scroll content offset and size
  const { scrollTop, scrollLeft, scrollHeight, scrollWidth } = ref.current;

  // If the difference between the height and scrollHeight is less than 1px, the browser doesn't allow scrolling anyway.
  return {
    top: scrollTop > 0,
    bottom: (scrollHeight - height > 1) && (scrollTop + height < scrollHeight),
    left: scrollLeft > 0,
    right: (scrollWidth - width > 1) && (scrollLeft + width < scrollWidth),
  };
};

/**
 * Return type for useScrollIndicators() hook.
 */
type UseScrollIndicatorsReturn = {
  ref: RefObject<HTMLDivElement>;
  updateIndicators: UIEventHandler<HTMLDivElement>;
  indicators: ReactElement[];
};

/**
 * A hook which enables the rendering of gradient and bordered scroll indicators on the edges of a scroll viewport.
 * @param borders - Side or sides to render a border on.
 * @returns A object containing a viewport ref, onScroll handler, and four sides' indicator elements.
 */
export const useScrollIndicators = (borders?: string | string[]): UseScrollIndicatorsReturn => {
  const ref = useRef<ElementRef<typeof Viewport>>(null);

  const [visible, setVisible] = useState<FourSidedState>({
    top: false,
    bottom: false,
    left: false,
    right: false,
  });

  // Memoize since it will rarely, if ever, change
  const bordered = useMemo(() => getBorderVisibility(borders), [borders]);

  const updateIndicatorVisibility = () => {
    setVisible(getIndicatorVisibility(ref));
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

  return {
    ref,
    updateIndicators: updateIndicatorVisibility,
    indicators: Object.keys(defaultState).map((key): ReactElement => (
      <div
        className={styles.ScrollArea_Indicator}
        key={key}
        data-side={key}
        data-visible={visible[key as keyof typeof defaultState]}
        data-bordered={bordered[key as keyof typeof defaultState]}
      />
    )),
  };
};
