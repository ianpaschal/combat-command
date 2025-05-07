import { useEffect, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  rectIntersection,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { AnimatePresence } from 'framer-motion';

import {
  PairingResult,
  RankedCompetitor,
  TournamentCompetitorId,
  TournamentPairingMethod,
  tournamentPairingMethodOptions,
} from '~/api';
import { Button } from '~/components/generic/Button';
import { InputSelect } from '~/components/generic/InputSelect';
import { Label } from '~/components/generic/Label';
import { Separator } from '~/components/generic/Separator';
import { Draggable } from '../Draggable';
import { Droppable } from '../Droppable';
import { PairableCompetitorCard } from '../PairableCompetitorCard';
import { PairingsGridRow } from '../PairingsGridRow';
import { usePairingsGrid } from './PairingsStep.hooks';

// import { useTournament } from '~/components/TournamentProvider';
// import { PairingGrid } from './PairingsGrid';
import styles from './PairingsStep.module.scss';

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

const draftPairingResults: PairingResult = {
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

export const PairingsStep = (): JSX.Element => {
  // const tournament = useTournament();
  const [pairingMethod, setPairingMethod] = useState<TournamentPairingMethod>('random'); // TODO: Auto set based on tournament info

  const pairingIndexes = Array.from({ length: Math.floor(rankedCompetitors.length / 2) }, (_, i) => i);

  const {
    state,
    handleDragStart,
    handleDragEnd,
    // reset,
  } = usePairingsGrid(draftPairingResults);
  useEffect(() => {
    document.body.style.cursor = state.activeCompetitor ? 'grabbing' : 'default';
    return () => {
      document.body.style.cursor = 'default';
    };
  }, [state]);

  const handleChangePairingMethod = (value: TournamentPairingMethod): void => {
    // If dirty, show a warning before changing
    if (state.dirty) {
      alert('Are you sure?');
    } else {
      setPairingMethod(value);
    }
  };

  // const handleConfirmChange = (value: TournamentPairingMethod): void => {
  //   // Close dialog
  //   // Reset
  //   setPairingMethod(value);
  // };

  const handleReset = (): void => {
    // If dirty, show a warning before resetting
    if (state.dirty) {
      alert('Are you sure?');
    }
  };

  // const handleConfirmReset = (): void => {
  //   // Close dialog
  //   // Reset
  //   reset();
  // };

  // const handleSubmit = (): void => {

  // };

  // const handleConfirmSubmit = (): void => {

  // };

  return (
    <div className={styles.PairingStep}>
      <div className={styles.PairingStep_PairingMethodSection}>
        <Label>Pairing Method</Label>
        <InputSelect
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onChange={handleChangePairingMethod}
          options={tournamentPairingMethodOptions}
          value={pairingMethod}
        />
        <Button onClick={handleReset}>
          Reset
        </Button>
      </div>
      <Separator />
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
              <PairingsGridRow key={i} index={i} activeCompetitor={state.activeCompetitor} pairing={state.pairings[i]} />
            ))}
          </div>
          <div className={styles.UnpairedSection}>
            <Label>Unpaired Competitors</Label>
            <Droppable key="unpaired" id="unpaired" className={styles.UnpairedPool}>
              <AnimatePresence>
                {state.unpairedCompetitors.map((competitor) => (
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
          {state.activeCompetitor && (
            <DragOverlay
              dropAnimation={{ duration: grabMotionDuration * 1000, easing: 'ease' }}
            >
              <Draggable id={state.activeCompetitor.id}>
                <PairableCompetitorCard
                  competitorId={state.activeCompetitor.id}
                  rank={state.activeCompetitor.rank}
                  {...grabAnimationProps}
                />
              </Draggable>
            </DragOverlay>
          )}
        </AnimatePresence>
      </DndContext>
    </div>
  );
};
