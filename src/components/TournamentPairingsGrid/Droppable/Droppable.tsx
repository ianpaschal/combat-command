import React, { CSSProperties } from 'react';
import { UniqueIdentifier, useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';

import styles from './Droppable.module.scss';

export interface DroppableProps {
  children: React.ReactNode;
  className?: string;
  id: UniqueIdentifier;
  invalid?: boolean;
  style?: CSSProperties;
}

export const Droppable = ({
  children,
  className,
  id,
  invalid,
  style = {},
}: DroppableProps): JSX.Element => {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={clsx(styles.Droppable, className)}
      data-over={isOver}
      data-invalid={invalid}
      style={style}
    >
      {children}
    </div>
  );
};
