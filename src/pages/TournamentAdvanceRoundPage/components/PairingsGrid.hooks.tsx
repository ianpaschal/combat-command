import { useState } from 'react';

// import { DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import { PairingResult, TournamentCompetitorId } from '~/api';

// type PairingsState = {
//   [key: string]: TournamentCompetitorId | TournamentCompetitorId[];
//   unpaired: TournamentCompetitorId[];
// };

// const convertPairingResultToStateOld = ({
//   pairings,
//   unpairedCompetitors,
// }: PairingResult): PairingsState => ({
//   ...pairings.reduce((acc, pairing, i) => ({
//     ...acc,
//     [`pairing_${i}_0`]: pairing[0].id,
//     [`pairing_${i}_1`]: pairing[1].id,
//   }), {}),
//   unpaired: unpairedCompetitors.map((competitor) => competitor.id),
// });

type PairingsGridState = Record<TournamentCompetitorId, string>;

const convertPairingResultToState = ({
  pairings,
  unpairedCompetitors,
}: PairingResult): PairingsGridState => ({
  ...pairings.reduce((acc, pairing, i) => ({
    ...acc,
    [pairing[0].id]: `pairing_${i}_0`,
    [pairing[1].id]: `pairing_${i}_1`,
  }), {}),
  ...unpairedCompetitors.reduce((acc, competitor) => ({
    ...acc,
    [competitor.id]: 'unpaired',
  }), {}),
});

// const convertPairingResultToCompetitorList = ({
//   pairings,
//   unpairedCompetitors,
// }: PairingResult): RankedCompetitor[] => pairings.reduce((acc, pairing) => [
//   ...acc,
//   pairing[0],
//   pairing[1],
// ], [
//   ...unpairedCompetitors,
// ]);

export const usePairingsGrid = (pairingResult: PairingResult) => {

  // TODO: Get list of compettiros flatted from pairing result
  // TODO: Get pairings state from pairing result

  // const competitors = convertPairingResultToCompetitorList(pairingResult);

  const [gridState, setGridState] = useState<PairingsGridState>(convertPairingResultToState(pairingResult));
  // useEffect(() => {
  //   setGridState(convertPairingResultToState(pairingResult));
  // }, [pairingResult, setGridState]);

  const moveCompetitor = (competitorId: TournamentCompetitorId, targetSlotId: string): void => {

    // If current slot and target slot are the same, do nothing
    if (targetSlotId === gridState[competitorId]) {
      return;
    }

    const updatedGridState: PairingsGridState = {
      ...gridState,
      [competitorId]: targetSlotId,
    };

    // If there is a competitor in that slot, move it to unpaired
    const reversedState = Object.entries(gridState).reduce((acc, [key, value]) => ({
      ...acc,
      [value]: key,
    }), {} as { [key: string]: string });
    const existingCompetitorId = reversedState[targetSlotId] as TournamentCompetitorId;
    if (existingCompetitorId) {
      updatedGridState[existingCompetitorId] = 'unpaired';
    }

    setGridState(updatedGridState);
  };

  return {
    state: gridState,
    moveCompetitor,
  };
};
