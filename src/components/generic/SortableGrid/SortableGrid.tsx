import {
  CSSProperties,
  ReactNode,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import {
  closestCenter,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arraySwap,
  rectSwappingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import clsx from 'clsx';

import { SortableItem } from './components/SortableItem';

import styles from './SortableGrid.module.scss';

export interface SortableGridProps {
  className?: string;
  itemClassName?: string;
  columns?: number;
  items: UniqueIdentifier[];
  onChange: (items: UniqueIdentifier[]) => void;
  renderItem: (id: UniqueIdentifier, state: {
    activeId: UniqueIdentifier | null;
    isActive: boolean;
    isOverlay: boolean;
  }) => ReactNode;
}

export const SortableGrid = ({
  className,
  itemClassName,
  columns = 1,
  items,
  onChange,
  renderItem,
}: SortableGridProps): JSX.Element => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      // Disable smooth scrolling in Cypress automated tests
      scrollBehavior: 'Cypress' in window ? 'auto' : undefined,
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const getIndex = (id: UniqueIdentifier): number => items.indexOf(id);
  const activeIndex = activeId != null ? getIndex(activeId) : -1;

  const handleDragStart = ({ active }: DragStartEvent): void => {
    if (!active) {
      return;
    }
    setActiveId(active.id);
  };
  const handleDragEnd = ({ over }: DragEndEvent): void => {
    setActiveId(null);
    if (over) {
      const overIndex = getIndex(over.id);
      if (activeIndex !== overIndex) {
        const updated = arraySwap(items, activeIndex, overIndex);
        onChange(updated);
      }
    }
  };
  const handleDragCancel = (): void => {
    setActiveId(null);
  };

  const style: CSSProperties = {
    gridTemplateColumns: Array.from({ length: columns }).map((_) => '1fr').join(' '),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={items} strategy={rectSwappingStrategy}>
        <div className={clsx(styles.Grid, className)} style={style}>
          {items.map((id) => (
            <SortableItem key={id} id={id} className={itemClassName}>
              {renderItem(id, {
                activeId,
                isActive: activeId === id,
                isOverlay: false,
              })}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
      {createPortal(
        <DragOverlay
          adjustScale
          dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: {
                  opacity: '0.5',
                },
              },
            }),
          }}
        >
          {activeId != null ? (
            <SortableItem id={activeId} overlay>
              {renderItem(activeId, {
                activeId,
                isActive: true,
                isOverlay: true,
              })}
            </SortableItem>
          ) : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
};
