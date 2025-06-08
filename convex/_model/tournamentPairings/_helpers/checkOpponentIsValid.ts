import { DraftTournamentPairing, RankedTournamentCompetitor } from '../types';

/**
 * Checks if two RankedTournamentCompetitors make for valid opponents.
 * 
 * @param a - RankedTournamentCompetitor A
 * @param b - RankedTournamentCompetitor A
 * @param pairings - All other DraftTournamentPairings
 * @returns True if the match-up is valid, false if it is not
 */
export const checkOpponentIsValid = (
  a: RankedTournamentCompetitor,
  b: RankedTournamentCompetitor,
  pairings: DraftTournamentPairing[],
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
