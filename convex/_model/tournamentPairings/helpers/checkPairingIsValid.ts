import { Id } from '../../../_generated/dataModel';
import { DraftPairing } from './pairingTypes';

export function checkPairingIsValid(pairing: Partial<DraftPairing>): boolean {
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
}

export function checkAllPairingsValidity(pairings: DraftPairing[]): boolean {
  const pairedCompetitorIds: Id<'tournamentCompetitors'>[] = [];
  for (const pairing of pairings) {
    if (!checkPairingIsValid(pairing)) {
      return false;
    }
    for (let i = 0; i < 2; i++) {
      const competitor = pairing[i];
      if (competitor) {
        if (pairedCompetitorIds.includes(competitor.id)) {
          return false;
        }
        pairedCompetitorIds.push(competitor.id);
      }
    }
  }
  return true;
}
