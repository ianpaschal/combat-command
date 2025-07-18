import { ShallowTournamentPairing } from '..';
import { DraftTournamentPairing } from '../queries/getDraftTournamentPairings';
import { TournamentPairingDeep } from './deepenTournamentPairing';

type AnyPairing = TournamentPairingDeep | ShallowTournamentPairing | DraftTournamentPairing;

export const sortPairingsByTable = <T extends AnyPairing>(
  pairings: T[],
): T[] => pairings.sort((a, b) => {
  const aTable = a.table;
  const bTable = b.table;
  
  // Handle null or undefined table values
  const aIsNull = aTable === null || aTable === undefined;
  const bIsNull = bTable === null || bTable === undefined;
  
  if (aIsNull && bIsNull) {
    return 0;
  }
  if (aIsNull) {
    return 1;
  }
  if (bIsNull) {
    return -1;
  }
  
  return aTable - bTable;
});
