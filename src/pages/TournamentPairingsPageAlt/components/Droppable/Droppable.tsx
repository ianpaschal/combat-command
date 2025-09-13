import { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';

import styles from './Droppable.module.scss';

export interface DroppableProps {
  id: string;
  children: ReactNode;
}

export const Droppable = ({
  id,
  children,
}: DroppableProps): JSX.Element => {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={styles.Droppable}
      data-hover={isOver}
    >
      {children}
    </div>
  );
};
