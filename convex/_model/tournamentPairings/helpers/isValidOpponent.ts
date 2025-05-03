import { DraftPairing, RankedCompetitor } from './pairingTypes';

export const isValidOpponent = (
  a: RankedCompetitor,
  b: RankedCompetitor,
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
    const pairingIds = pairing.map((c) => c.id);
    return pairingIds.includes(a.id) || pairingIds.includes(b.id);
  });
  if (alreadyPaired) {
    return false;
  }
  return true;
};
