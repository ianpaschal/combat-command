import {
  CSSProperties,
  ElementRef,
  RefObject,
  UIEvent,
  UIEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ScrollArea } from 'radix-ui';

import { ColumnDef, RowData } from './Table.types';

/**
 * Return type for useScrollIndicators() hook.
 */
type UseScrollIndicatorsReturn = {
  ref: RefObject<HTMLDivElement>;
  updateIndicators: UIEventHandler<HTMLDivElement>;
  visible: boolean;
};

export const useScrollIndicator = (): UseScrollIndicatorsReturn => {
  const ref = useRef<ElementRef<typeof ScrollArea.Viewport>>(null);

  const [visible, setVisible] = useState<boolean>(false);

  const updateIndicatorVisibility = (e?: UIEvent) => {
    const scrollElement = e?.currentTarget || ref.current;
    if (!scrollElement) {
      return;
    }
    setVisible(scrollElement.scrollTop > 0);
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
    visible,
  };
};

export const useGridStyle = <T extends RowData>(
  columns: ColumnDef<T>[],
) => useMemo((): CSSProperties => ({
  gridTemplateColumns: columns.map((c, i) => {
    const isFirst = i === 0;
    const isLast = i + 1 === columns.length;
    const baseWidth = typeof c.width === 'number' ? `${c.width}px` : c.width;
    if (baseWidth && baseWidth !== 'auto') {
      if (isFirst) {
        return `calc(var(--table-padding-left) + ${baseWidth})`;
      }
      if (isLast) {
        return `calc(var(--table-padding-right) + ${baseWidth})`;
      }
      return baseWidth;
    }
    return 'auto';
  }).join(' '),
}), [columns]);
