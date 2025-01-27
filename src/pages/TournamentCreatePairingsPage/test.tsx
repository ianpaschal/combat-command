import { useState } from 'react';
import {
  closestCenter,
  closestCorners,
  CollisionDetection as CollisionDetectionType,
  DndContext,
  Modifiers,
  pointerWithin,
  rectIntersection,
  UniqueIdentifier,
  useDraggable,
} from '@dnd-kit/core';

import { Draggable, DraggableOverlay } from '~/pages/TournamentCreatePairingsPage/Draggable';
import { Droppable } from '~/pages/TournamentCreatePairingsPage/Droppable';
import { GridContainer } from '~/pages/TournamentCreatePairingsPage/GridContainer';
import { Wrapper } from '~/pages/TournamentCreatePairingsPage/Wrapper';

export default {
  title: 'Core/Droppable/useDroppable',
};

interface Props {
  collisionDetection?: CollisionDetectionType;
  containers?: string[];
  modifiers?: Modifiers;
  value?: string;
}

function DroppableStory({
  containers = ['A'],
  collisionDetection,
  modifiers,
}: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [parent, setParent] = useState<UniqueIdentifier | null>(null);

  const item = <DraggableItem />;

  return (
    <DndContext
      collisionDetection={collisionDetection}
      modifiers={parent === null ? undefined : modifiers}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={({ over }) => {
        setParent(over ? over.id : null);
        setIsDragging(false);
      }}
      onDragCancel={() => setIsDragging(false)}
    >
      <Wrapper>
        <Wrapper style={{ width: 350, flexShrink: 0 }}>
          {parent === null ? item : null}
        </Wrapper>
        <GridContainer columns={2}>
          {containers.map((id) => (
            <Droppable key={id} id={id} dragging={isDragging}>
              {parent === id ? item : null}
            </Droppable>
          ))}
        </GridContainer>
      </Wrapper>
      <DraggableOverlay />
    </DndContext>
  );
}

interface DraggableProps {
  handle?: boolean;
}

function DraggableItem({ handle }: DraggableProps) {
  const { isDragging, setNodeRef, listeners } = useDraggable({
    id: 'draggable-item',
  });

  return (
    <Draggable
      dragging={isDragging}
      ref={setNodeRef}
      handle={handle}
      listeners={listeners}
      style={{
        opacity: isDragging ? 0 : undefined,
      }}
    />
  );
}

export const MultipleDroppables = () => (
  <DroppableStory containers={['A', 'B', 'C']} />
);
