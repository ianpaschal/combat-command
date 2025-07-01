import { DraftTournamentPairing } from '../TournamentPairingsGrid.types';

/**
 * Checks if a DraftPairing is valid.
 * 
 * @param pairing - DraftPairing to check
 * @returns True if the resulting TournamentPairing would be valid, false if not
 */
export const checkDraftPairingIsValid = (
  pairing: Partial<DraftTournamentPairing>,
): boolean => {
  if (!pairing || !pairing[0] || !pairing[1]) {
    return false;
  }
  if (pairing[0].id === pairing[1].id) {
    return false;
  }
  if (pairing[0].opponentIds.includes(pairing[1].id)) {
    return false;
  }
  if (pairing[1].opponentIds.includes(pairing[0].id)) {
    return false;
  }
  return true;
};
