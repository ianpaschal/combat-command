import {
  DraftPairing,
  PairingResult,
  RankedCompetitor,
  TournamentCompetitorId,
} from '~/api';

export const convertPairingResultToCompetitorList = (pairingResult?: PairingResult): RankedCompetitor[] => {
  if (!pairingResult) {
    return [];
  }
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

export const buildGridState = (pairingResult?: PairingResult): Record<TournamentCompetitorId, string> => {
  if (!pairingResult) {
    return {};
  }
  const pairedCompetitors = pairingResult.pairings.reduce((acc, pairing, i) => {
    const newAcc = {
      ...acc,
    };
    pairing.forEach((competitor, j) => {
      if (competitor) {
        newAcc[competitor.id] = `${i}_${j}`;
      }
    });
    return newAcc;
  }, {} as Record<TournamentCompetitorId, string>);
  const unpairedCompetitors = pairingResult.unpairedCompetitors.reduce((acc, competitor) => ({
    ...acc,
    [competitor.id]: 'unpaired',
  }), {} as Record<TournamentCompetitorId, string>);
  return {
    ...pairedCompetitors,
    ...unpairedCompetitors,
  };
};

export const buildPairingResult = (competitors: RankedCompetitor[], state: Record<TournamentCompetitorId, string>): PairingResult => {
  if (!competitors?.length || !Object.keys(state).length) {
    return {
      pairings: [],
      unpairedCompetitors: [],
    };
  }
  const statefulCompetitors = competitors.map((competitor) => ({
    competitor,
    slotId: state[competitor.id],
  }));
  const pairings: DraftPairing[] = [];
  const unpairedCompetitors: RankedCompetitor[] = [];
  statefulCompetitors.map(({ competitor, slotId }) => {
    if (slotId === 'unpaired') {
      unpairedCompetitors.push(competitor);
    } else {
      const [i,j] = slotId.split('_').map((i) => parseInt(i, 10));
      if (!pairings[i]) {
        pairings[i] = [null, null] as unknown as DraftPairing;
      }
      pairings[i][j] = competitor;
    }
  });
  return {
    pairings,
    unpairedCompetitors,
  };
};
