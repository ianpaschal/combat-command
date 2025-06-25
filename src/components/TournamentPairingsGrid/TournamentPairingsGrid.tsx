import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  rectIntersection,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import isEqual from 'fast-deep-equal';
import { AnimatePresence } from 'framer-motion';

import { TournamentCompetitorId, TournamentCompetitorRanked } from '~/api';
import { Label } from '~/components/generic/Label';
import { useTournament } from '~/components/TournamentProvider';
import { Draggable } from './Draggable';
import { Droppable } from './Droppable';
import { PairableCompetitorCard } from './PairableCompetitorCard';
import { PairingsGridRow } from './PairingsGridRow';
import { DraftTournamentPairing, PairingsGridState } from './TournamentPairingsGrid.types';
import {
  buildGridState,
  buildPairingResult,
  convertPairingResultToCompetitorList,
} from './TournamentPairingsGrid.utils';

import styles from './TournamentPairingsGrid.module.scss';

const grabMotionDuration = 0.150;
const grabMotionInitial = {
  scale: 1,
  boxShadow: '0px 0px 0px rgba(0, 0, 0, 0)',
};
const grabMotionAnimate = {
  scale: 1.05,
  boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
};
const grabAnimationProps = {
  initial: grabMotionInitial,
  animate: grabMotionAnimate,
  exit: grabMotionInitial,
  transition: { duration: grabMotionDuration },
};

export interface TournamentPairingsGridProps {
  defaultValue?: DraftTournamentPairing[];
  onChange: (value: DraftTournamentPairing[]) => void;
}

export interface TournamentPairingsGridHandle {
  reset: (pairings: DraftTournamentPairing[]) => void;
  isDirty: boolean;
}

export const TournamentPairingsGrid = forwardRef<TournamentPairingsGridHandle, TournamentPairingsGridProps>(({
  defaultValue,
  onChange,
}: TournamentPairingsGridProps, ref): JSX.Element => {
  const tournament = useTournament();
  const pairingIndexes = Array.from({ length: Math.ceil(tournament.maxCompetitors / 2) }, (_, i) => i);

  // Store competitors with their opponentIds so we can check pairing validity:
  const competitors = useMemo(() => convertPairingResultToCompetitorList(defaultValue), [defaultValue]);

  // State:
  const [activeCompetitorId, setActiveCompetitorId] = useState<TournamentCompetitorId | null>(null);
  const [gridState, setGridState] = useState<PairingsGridState | null>(null);

  // Set internal state from parent:
  useEffect(() => {
    if (defaultValue && !gridState) {
      setGridState(buildGridState(defaultValue));
    }
  }, [defaultValue, gridState]);

  const pairingResult = useMemo(() => buildPairingResult(competitors, gridState), [competitors, gridState]);
  const isDirty = !isEqual(defaultValue, pairingResult);

  // Emit change to parent components:
  useEffect(() => {
    onChange(pairingResult);
  }, [pairingResult, onChange]);

  // Allow parent to reset and track dirty state:
  useImperativeHandle(ref, () => ({
    reset: (pairings: DraftTournamentPairing[]): void => setGridState(buildGridState(pairings)),
    pairingResult,
    isDirty,
  }));

  useEffect(() => {
    document.body.style.cursor = activeCompetitorId ? 'grabbing' : 'default';
    return () => {
      document.body.style.cursor = 'default';
    };
  }, [activeCompetitorId]);

  const handleDragStart = ({ active }: DragStartEvent) => {
    if (active) {
      setActiveCompetitorId(active.id as TournamentCompetitorId);
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || !gridState) {
      return;
    }
    setActiveCompetitorId(null);
    setGridState(Object.entries(gridState).map(([competitorId, slotId]) => {

      // If this ID is the active one, we're dragging it. Set it's slotID to 'over':
      if (competitorId === active.id) {
        return [competitorId, over.id];
      }

      // If this slot is the target, move its competitor to 'unpaired':
      if (slotId === over.id) {
        return [competitorId, 'unpaired'];
      }

      // Otherwise do nothing:
      return [competitorId, slotId];
    }).reduce((acc, [pairingCompetitorId, slotId]) => ({
      ...acc,
      [pairingCompetitorId as TournamentCompetitorId]: slotId,
    }), {}));
  };

  const unpairedCompetitors = competitors.filter((c) => gridState && gridState[c.id] === 'unpaired');
  const activeCompetitor = competitors.find((c) => c.id === activeCompetitorId);
  const gridStatePivoted = Object.entries(gridState ?? {}).reduce((acc, [competitorId, slotId]) => ({
    ...acc,
    [slotId]: competitors.find((c) => c.id === competitorId),
  }), {} as Record<string, TournamentCompetitorRanked | undefined>);

  return (
    <DndContext
      modifiers={[restrictToWindowEdges]}
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <div className={styles.PairingsGrid}>
        <div className={styles.PairedSection}>
          <Label>Pairings</Label>
          {pairingIndexes.map((i) => {
            const pairing: DraftTournamentPairing = [
              gridStatePivoted[`${i}_0`] ?? null,
              gridStatePivoted[`${i}_1`] ?? null,
            ];
            return (
              <PairingsGridRow key={i} index={i} activeCompetitor={activeCompetitor} pairing={pairing} />
            );
          })}
        </div>
        <div className={styles.UnpairedSection}>
          <Label>Unpaired Competitors</Label>
          <Droppable key="unpaired" id="unpaired" className={styles.UnpairedPool}>
            <AnimatePresence>
              {unpairedCompetitors.map((competitor) => (
                <Draggable id={competitor.id} key={competitor.id}>
                  <PairableCompetitorCard
                    competitorId={competitor.id}
                    rank={competitor.rank}
                    key={`card_${competitor.id}`}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.25 }}
                  />
                </Draggable>
              ))}
            </AnimatePresence>
          </Droppable>
        </div>
      </div>
      <AnimatePresence>
        {activeCompetitor && (
          <DragOverlay dropAnimation={{ duration: grabMotionDuration * 1000, easing: 'ease' }}>
            <Draggable id={activeCompetitor.id}>
              <PairableCompetitorCard
                competitorId={activeCompetitor.id}
                rank={activeCompetitor.rank}
                {...grabAnimationProps}
              />
            </Draggable>
          </DragOverlay>
        )}
      </AnimatePresence>
    </DndContext>
  );
});
