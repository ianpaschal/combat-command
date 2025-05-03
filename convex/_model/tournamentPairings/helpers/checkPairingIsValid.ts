import { Id } from '../../../_generated/dataModel';
import { DraftPairing } from './pairingTypes';

export function checkPairingIsValid(pairing: DraftPairing): boolean {
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
    if (pairedCompetitorIds.includes(pairing[0].id) || pairedCompetitorIds.includes(pairing[0].id) ) {
      return false;
    }
    pairedCompetitorIds.push(pairing[0].id, pairing[1].id);
  }
  return true;
}
