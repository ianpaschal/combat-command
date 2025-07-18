import {
  forwardRef,
  memo,
  ReactNode,
  useEffect,
} from 'react';
import { UniqueIdentifier } from '@dnd-kit/core';
import { arraySwap, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';

import styles from './SortableItem.module.scss';

interface SortableItemProps {
  className?: string;
  id: UniqueIdentifier;
  children: ReactNode;
  overlay?: boolean;
}

export const SortableItem = memo(forwardRef<HTMLDivElement, SortableItemProps>(({
  className,
  id,
  children,
  overlay = false,
  ...props
}, ref) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    getNewIndex: ({
      id,
      items,
      activeIndex,
      overIndex,
    }) => arraySwap(items, activeIndex, overIndex).indexOf(id),
  });

  useEffect(() => {
    if (!overlay) {
      return;
    }
    document.body.style.cursor = 'grabbing';
    return () => {
      document.body.style.cursor = '';
    };
  }, [overlay]);

  return (
    <div
      className={styles.SortableItem_Wrapper}
      data-overlay={overlay}
      ref={overlay ? ref : setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div
        className={clsx(styles.SortableItem_Content, className)}
        data-overlay={overlay}
        data-ghost={isDragging && !overlay}
        data-cypress="draggable-item"
        {...attributes}
        {...listeners}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}));
