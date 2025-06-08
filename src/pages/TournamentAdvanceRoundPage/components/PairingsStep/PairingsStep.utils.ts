import { DraftTournamentPairing, UnassignedTournamentPairing } from '~/api';

export const convertDraftPairingsToUnassignedPairings = (
  draftTournamentPairings: DraftTournamentPairing[],
): UnassignedTournamentPairing[] => [
  ...draftTournamentPairings.map((tournamentPairing) => ({
    tournamentCompetitor0Id: tournamentPairing[0].id,
    tournamentCompetitor1Id: tournamentPairing[1]?.id ?? null,
    playedTables: Array.from(new Set([
      ...tournamentPairing[0].playedTables,
      ...(tournamentPairing[1]?.playedTables || []),
    ])),
  })),
];
