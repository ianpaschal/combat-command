import { DraftTournamentPairings, UnassignedTournamentPairing } from '~/api';

export const convertPairingResult = (
  pairingResult: DraftTournamentPairings,
): UnassignedTournamentPairing[] => [
  ...pairingResult.pairings.map((pairing) => ({
    tournamentCompetitor0Id: pairing[0].id,
    tournamentCompetitor1Id: pairing[1].id,
    playedTables: Array.from(new Set([
      ...pairing[0].playedTables,
      ...pairing[1].playedTables,
    ])),
  })),
  ...pairingResult.unpairedCompetitors.map(({ id, playedTables }) => ({
    tournamentCompetitor0Id: id,
    tournamentCompetitor1Id: null,
    playedTables,
  })),
];
