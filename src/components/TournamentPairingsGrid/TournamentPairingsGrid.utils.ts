import {
  DraftTournamentPairing,
  TournamentCompetitorId,
  TournamentCompetitorRanked,
} from '~/api';

export const convertPairingResultToCompetitorList = (draftPairings?: DraftTournamentPairing[]): TournamentCompetitorRanked[] => {
  if (!draftPairings) {
    return [];
  }
  const competitors = new Set<TournamentCompetitorRanked>();
  draftPairings.forEach((pairing) => {
    if (pairing[0]) {
      competitors.add(pairing[0]);
    }
    if (pairing[1]) {
      competitors.add(pairing[1]);
    }
  });
  return Array.from(competitors);
};

export const buildGridState = (draftPairings?: DraftTournamentPairing[]): Record<TournamentCompetitorId, string> => {
  if (!draftPairings) {
    return {};
  }
  return draftPairings.reduce((acc, pairing, i) => {
    if (!pairing[1]) {
      return {
        ...acc,
        [pairing[0].id]: 'unpaired',
      };
    }
    return {
      ...acc,
      [pairing[0].id]: `${i}_0`,
      [pairing[1].id]: `${i}_1`,
    };
  }, {} as Record<TournamentCompetitorId, string>);
};

export const buildPairingResult = (competitors: TournamentCompetitorRanked[], state: Record<TournamentCompetitorId, string>): DraftTournamentPairing[] => {
  if (!competitors?.length || !Object.keys(state).length) {
    return [];
  }
  const statefulCompetitors = competitors.map((competitor) => ({
    competitor,
    slotId: state[competitor.id],
  }));

  const pairings: DraftTournamentPairing[] = [];

  // Add all full pairings:
  const pairedCompetitors = statefulCompetitors.filter(({ slotId }) => slotId !== 'unpaired');
  for (const { competitor, slotId } of pairedCompetitors) {
    const [i,j] = slotId.split('_').map((i) => parseInt(i, 10));
    if (!pairings[i]) {
      pairings[i] = [null, null] as unknown as DraftTournamentPairing;
    }
    pairings[i][j] = competitor;
  }

  // Add all partial pairings:
  const unpairedCompetitors = statefulCompetitors.filter(({ slotId }) => slotId === 'unpaired');
  for (const { competitor } of unpairedCompetitors) {
    pairings.push([competitor, null]);
  }

  return pairings;
};
