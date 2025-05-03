import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  rectIntersection,
  UniqueIdentifier,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleCheck, Radio } from 'lucide-react';

import {
  PairingResult,
  RankedCompetitor,
  TournamentCompetitorId,
  // TournamentPairingMethod,
} from '~/api';
import { Label } from '~/components/generic/Label';
// import { useTournament } from '~/components/TournamentProvider';
import { Draggable } from '~/pages/TournamentAdvanceRoundPage/components/Draggable';
import { Droppable } from '~/pages/TournamentAdvanceRoundPage/components/Droppable';
import { usePairingsGrid } from '~/pages/TournamentAdvanceRoundPage/components/PairingsGrid.hooks';

import styles from './PairingsGrid.module.scss';

const modifiers = [
  restrictToWindowEdges,
];

export const PairingGrid = (): JSX.Element => {
  // const tournament = useTournament();
  // const [pairingMethod, setPairingMethod] = useState<TournamentPairingMethod>('random'); // TODO: Auto set based on tournament info

  // const handleChangePairingMethod = (value: TournamentPairingMethod): void => {
  //   // If dirty, show a warning before changing
  //   setPairingMethod(value);
  // };

  const rankedCompetitors: RankedCompetitor[] = [
    { id: 'A' as TournamentCompetitorId, opponentIds: ['E' as TournamentCompetitorId], rank: 0 },
    { id: 'B' as TournamentCompetitorId, opponentIds: ['F' as TournamentCompetitorId], rank: 1 },
    { id: 'C' as TournamentCompetitorId, opponentIds: ['G' as TournamentCompetitorId], rank: 2 },
    { id: 'D' as TournamentCompetitorId, opponentIds: ['H' as TournamentCompetitorId], rank: 3 },
    { id: 'E' as TournamentCompetitorId, opponentIds: ['A' as TournamentCompetitorId], rank: 4 },
    { id: 'F' as TournamentCompetitorId, opponentIds: ['B' as TournamentCompetitorId], rank: 5 },
    { id: 'G' as TournamentCompetitorId, opponentIds: ['C' as TournamentCompetitorId], rank: 6 },
    { id: 'H' as TournamentCompetitorId, opponentIds: ['D' as TournamentCompetitorId], rank: 7 },
    { id: 'K' as TournamentCompetitorId, opponentIds: ['L' as TournamentCompetitorId], rank: 8 },
  ];

  const draftPairings: PairingResult = {
    pairings: [
      [rankedCompetitors[0], rankedCompetitors[1]],
      [rankedCompetitors[2], rankedCompetitors[3]],
      [rankedCompetitors[4], rankedCompetitors[5]],
      [rankedCompetitors[6], rankedCompetitors[7]],
    ],
    unpairedCompetitors: [
      rankedCompetitors[8],
    ],
  };

  // TODO: Use max competitors / 2
  const targetPairingCount = 8;
  const pairingIndexes = Array.from({ length: targetPairingCount }, (_, i) => i);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const activeCompetitor = rankedCompetitors.find((c) => activeId && c.id === activeId);

  const { state: pairingState, moveCompetitor } = usePairingsGrid(draftPairings);

  const handleDragStart = ({ active }: DragStartEvent) => {
    if (active) {
      setActiveId(active.id);
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) {
      return;
    }
    setActiveId(null);
    moveCompetitor(active.id as TournamentCompetitorId, over.id as string);
  };

  const getCompetitorIdsForSlot = (
    slotId: string,
  ): TournamentCompetitorId[] => Object.entries(pairingState).filter(
    ([_, value]) => value === slotId,
  ).map(
    ([key]) => key as TournamentCompetitorId,
  );

  return (
    <div className={styles.PairingGrid}>
      <DndContext
        modifiers={modifiers}
        collisionDetection={rectIntersection}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <div className={styles.PairingSlots}>
          {pairingIndexes.map((i) => [
            <div>
              <CircleCheck />
              <Radio />
            </div>,
            ...[0, 1].map((j) => {
              const slotId = `pairing_${i}_${j}`;
              const competitorIds = getCompetitorIdsForSlot(slotId);
              const [oppositeCompetitorId] = getCompetitorIdsForSlot(`pairing_${i}_${j === 0 ? 1 : 0}`);
              const invalid = activeCompetitor?.opponentIds.includes(oppositeCompetitorId);
              return (
                <Droppable key={slotId} id={slotId} invalid={invalid}>
                  {competitorIds.map((id) => (
                    <Draggable id={id}>
                      <div className={clsx(styles.DragContent)}>
                        {id}
                      </div>
                    </Draggable>
                  ))}
                </Droppable>
              );
            }),
          ])}
          <div className={styles.UnpairedSection}>
            <Label>Unpaired Competitors</Label>
            <Droppable key="unpaired" id="unpaired" className={styles.UnpairedPool}>
              {getCompetitorIdsForSlot('unpaired').map((id) => (
                <Draggable id={id}>
                  <div className={clsx(styles.DragContent)}>
                    {id}
                  </div>
                </Draggable>
              ))}
            </Droppable>
          </div>

          {/* {slots.map((slot) => {
            const item = items.find((i) => i.id === slot.itemId);
            return (
              <Droppable key={slot.id} id={slot.id}>
                {slot.itemId && (
                  <Draggable id={item!.id}>
                    <div className={clsx(styles.DragContent)}>
                      {item!.label}
                    </div>
                  </Draggable>
                )}
              </Droppable>
            );
          })} */}
        </div>
        <AnimatePresence onExitComplete={() => {
          setActiveId(null);
        }}>
          {activeId && (
            <DragOverlay dropAnimation={{
              duration: 150,
              easing: 'ease',
            }}>
              <Draggable id={activeId}>
                <motion.div
                  key="drag-overlay"
                  initial={{ scale: 1, boxShadow: '0px 0px 0px rgba(0, 0, 0, 0)' }}
                  animate={{ scale: 1.05, boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)' }}
                  exit={{ scale: 1, boxShadow: '0px 0px 0px rgba(0, 0, 0, 0)' }}
                  transition={{ duration: 0.150 }}
                  className={clsx(styles.DragContent)}
                >
                  {activeId}
                </motion.div>
              </Draggable>
            </DragOverlay>
          )}
        </AnimatePresence>

        {/* <DragOverlay>
          <Draggable id={activeId || 'foo'}>
            <div className={clsx(styles.DragContent)}>
              float
            </div>
          </Draggable>
        </DragOverlay> */}

      </DndContext>
    </div>
  );
};
