import { ReactNode } from 'react';
import { UniqueIdentifier, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

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
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0 : 1,
    // cursor: isDragging ? 'grabbing' : 'grab',
  };
  return (
    <div
      ref={setNodeRef}
      className={styles.Draggable}
      style={style}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
};
