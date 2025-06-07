import { DraftPairing, RankedTournamentCompetitor } from './pairingTypes';

export const isValidOpponent = (
  a: RankedTournamentCompetitor,
  b: RankedTournamentCompetitor,
  pairings: DraftPairing[],
): boolean => {
  // Can't play themselves
  if (a.id === b.id) {
    return false;
  }
  // Already played each other
  if (a.opponentIds.includes(b.id) || b.opponentIds.includes(a.id)) {
    return false;
  }
  // Already paired elsewhere
  const alreadyPaired = !!pairings.find((pairing) => {
    const pairingIds = pairing.filter((c) => !!c).map((c) => c.id);
    return pairingIds.includes(a.id) || pairingIds.includes(b.id);
  });
  if (alreadyPaired) {
    return false;
  }
  return true;
};
