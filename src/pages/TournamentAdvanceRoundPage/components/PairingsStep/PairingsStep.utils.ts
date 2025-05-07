import {
  DraftPairing,
  PairingResult,
  RankedCompetitor,
} from '~/api';
import { PairingsGridState } from './PairingsStep.types';

// export const getRankedCompetitorFromPairingResult = (
//   pairingResult: PairingResult,
//   competitorId: string,
// ): RankedCompetitor => {
//   const competitor = [
//     ...pairingResult.pairings.flatMap(([a, b]) => [a, b].filter((c): c is RankedCompetitor => !!c)),
//     ...pairingResult.unpairedCompetitors,
//   ].find((rankedCompetitor) => rankedCompetitor.id === competitorId);
//   if (!competitor) {
//     throw new Error('invalid id');
//   }
//   return competitor;
// };

export const convertPairingResultToCompetitorList = (pairingResult: PairingResult): RankedCompetitor[] => {
  const competitors = new Set(pairingResult.unpairedCompetitors);
  pairingResult.pairings.forEach((pairing) => {
    if (pairing[0]) {
      competitors.add(pairing[0]);
    }
    if (pairing[1]) {
      competitors.add(pairing[1]);
    }
  });
  return Array.from(competitors);
};

export const convertPairingResultToGridState = (pairingResult: PairingResult): PairingsGridState => {
  const pairedCompetitors = pairingResult.pairings.reduce((acc, pairing, i) => ({
    ...acc,
    [pairing[0].id]: `${i}_0`,
    [pairing[1].id]: `${i}_1`,
  }), {});
  const unpairedCompetitors = pairingResult.unpairedCompetitors.reduce((acc, competitor) => ({
    ...acc,
    [competitor.id]: 'unpaired',
  }), {});
  return {
    ...pairedCompetitors,
    ...unpairedCompetitors,
  };
};

export const convertGridStateToPairingResult = (rankedCompetitors: RankedCompetitor[], gridState: PairingsGridState) => {
  const pairings: Partial<DraftPairing>[] = [];
  const unpairedCompetitors: RankedCompetitor[] = [];
  rankedCompetitors.forEach((competitor) => {
    const slotId = gridState[competitor.id!];
    if (slotId === 'unpaired') {
      unpairedCompetitors.push(competitor);
    } else {
      const [pairingIndex, competitorIndex] = slotId.split('_').map((i: string) => +i);
      if (!pairings[pairingIndex]) {
        pairings[pairingIndex] = [undefined, undefined];
      }
      pairings[pairingIndex][competitorIndex] = competitor;
    }
  });
  unpairedCompetitors.sort((a, b) => a.rank - b.rank);
  return {
    pairings,
    unpairedCompetitors,
  };
};
