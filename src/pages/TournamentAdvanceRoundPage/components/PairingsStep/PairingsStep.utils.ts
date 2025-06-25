import { UnassignedTournamentPairing } from '~/api';
import { DraftTournamentPairing } from '~/components/TournamentPairingsGrid';

export const convertDraftPairingsToUnassignedPairings = (
  draftTournamentPairings: DraftTournamentPairing[],
): UnassignedTournamentPairing[] => draftTournamentPairings.filter(([a, b]) => a || b).map(([a, b]) => {
  const playedTables = Array.from(
    new Set([
      ...(a?.playedTables ?? []),
      ...(b?.playedTables ?? []),
    ]),
  );
  if (a && !b) {
    return {
      tournamentCompetitor0Id: a.id,
      tournamentCompetitor1Id: null,
      playedTables,
    };
  }
  if (!a && b) {
    return {
      tournamentCompetitor0Id: b.id,
      tournamentCompetitor1Id: null,
      playedTables,
    };
  }
  // We've filtered out pairings with no competitors, and handled the one-sided ones above:
  return {
    tournamentCompetitor0Id: a!.id,
    tournamentCompetitor1Id: b!.id,
    playedTables,
  };
});
