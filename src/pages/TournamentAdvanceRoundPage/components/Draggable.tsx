import { ReactNode } from 'react';
import { UniqueIdentifier, useDraggable } from '@dnd-kit/core';

import styles from './Draggable.module.scss';

export interface DraggableProps {
  id: UniqueIdentifier;
  children: ReactNode;
  isOverlay?: boolean;
}

export const Draggable = ({
  id,
  children,
}: DraggableProps): JSX.Element => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({ id });

  return (
    <div
      ref={setNodeRef}
      className={styles.Draggable}
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
        opacity: isDragging ? 0 : 1,
      }}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
};
