import {
  useEffect,
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
import { AnimatePresence } from 'framer-motion';

import { PairingResult, TournamentCompetitorId } from '~/api';
import { Label } from '~/components/generic/Label';
import {
  buildGridState,
  buildPairingResult,
  convertPairingResultToCompetitorList,
} from '~/components/TournamentPairingsGrid/TournamentPairingsGrid.utils';
import { useTournament } from '~/components/TournamentProvider';
import { Draggable } from './Draggable';
import { Droppable } from './Droppable';
import { PairableCompetitorCard } from './PairableCompetitorCard';
import { PairingsGridRow } from './PairingsGridRow';

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
  value?: PairingResult;
  onChange: (value: PairingResult) => void;
}

export const TournamentPairingsGrid = ({
  value,
  onChange,
}: TournamentPairingsGridProps): JSX.Element => {
  const tournament = useTournament();
  const pairingIndexes = Array.from({ length: Math.ceil(tournament.maxCompetitors / 2) }, (_, i) => i);

  // Store competitors with their opponentIds so we can check pairing validity
  const competitors = useMemo(() => convertPairingResultToCompetitorList(value), [value]);
  const state = useMemo(() => buildGridState(value), [value]);

  const [activeCompetitorId, setActiveCompetitorId] = useState<TournamentCompetitorId | null>(null);

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
    if (!over) {
      return;
    }
    setActiveCompetitorId(null);
    const updatedInternalState = Object.entries(state).map(([pairingCompetitorId, slotId]) => {
      if (pairingCompetitorId === active.id) {
        return [pairingCompetitorId, over.id];
      }
      if (slotId === over.id) {
        return [pairingCompetitorId, 'unpaired'];
      }
      return [pairingCompetitorId, slotId];
    }).reduce((acc, [pairingCompetitorId, slotId]) => ({
      ...acc,
      [pairingCompetitorId as TournamentCompetitorId]: slotId,
    }), {});
    onChange(buildPairingResult(competitors, updatedInternalState));
  };

  const { pairings, unpairedCompetitors } = value ?? {
    pairings: [],
    unpairedCompetitors: [],
  };
  const activeCompetitor = competitors.find((c) => c.id === activeCompetitorId);

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
          {pairingIndexes.map((i) => (
            <PairingsGridRow key={i} index={i} activeCompetitor={activeCompetitor} pairing={pairings[i]} />
          ))}
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
};
