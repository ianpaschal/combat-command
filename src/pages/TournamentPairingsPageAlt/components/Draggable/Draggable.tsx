import { UniqueIdentifier, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { IdentityBadge } from '~/components/IdentityBadge';
import { useTournamentCompetitors } from '~/components/TournamentCompetitorsProvider';

import styles from './Draggable.module.scss';

export interface DraggableProps {
  id: UniqueIdentifier;
  overlay?: boolean;
  isDropping?: boolean;
}

export function Draggable({
  id,
  overlay = false,
  isDropping = false,
}: DraggableProps) {
  const competitors = useTournamentCompetitors();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      className={styles.Draggable}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      data-dragging={isDragging || undefined}
      data-overlay={overlay || undefined}
      data-dropping={isDropping || undefined}
      {...listeners}
      {...attributes}
    >
      <div className={styles.Inner} data-dragging={isDragging || undefined} data-overlay={overlay || undefined} data-dropping={isDropping || undefined}>
        <IdentityBadge competitor={competitors.find((v) => v._id === id)} />
      </div>
    </div>
  );
}
