import { useState } from 'react';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';

import { PairingResult, TournamentCompetitorId } from '~/api';
import { PairingsGridState } from './PairingsStep.types';
import {
  convertGridStateToPairingResult,
  convertPairingResultToCompetitorList,
  convertPairingResultToGridState,
} from './PairingsStep.utils';

export const usePairingsGrid = (pairingResult: PairingResult) => {

  // State
  const competitors = convertPairingResultToCompetitorList(pairingResult);
  const [activeCompetitorId, setActiveCompetitorId] = useState<TournamentCompetitorId | null>(null);
  const [dirty, setDirty] = useState<boolean>(false);
  const [gridState, setGridState] = useState<PairingsGridState>(convertPairingResultToGridState(pairingResult));
  // useEffect(() => {
  //   setGridState(convertPairingResultToState(pairingResult));
  // }, [pairingResult, setGridState]);

  // Internal handlers
  const moveCompetitor = (competitorId: TournamentCompetitorId, targetSlotId: string): void => {
    const updatedGridState = Object.entries(gridState).map(([pairingCompetitorId, slotId]) => {
      if (pairingCompetitorId === competitorId) {
        return [pairingCompetitorId, targetSlotId];
      }
      if (slotId === targetSlotId) {
        return [pairingCompetitorId, 'unpaired'];
      }
      return [pairingCompetitorId, slotId];
    }).reduce((acc, [pairingCompetitorId, slotId]) => ({
      ...acc,
      [pairingCompetitorId as TournamentCompetitorId]: slotId,
    }), {});
    setGridState(updatedGridState);
    setDirty(true);
  };

  // External handlers
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
    moveCompetitor(active.id as TournamentCompetitorId, over.id as string);
  };

  return {
    state: {
      ...convertGridStateToPairingResult(competitors, gridState),
      activeCompetitor: competitors.find((c) => c.id === activeCompetitorId),
      dirty,
    },
    handleDragStart,
    handleDragEnd,
    reset: () => setGridState(convertPairingResultToGridState(pairingResult)),
  };
};
