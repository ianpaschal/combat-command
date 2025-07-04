import { CompetitorPair } from './generateDraftPairings';

export const sortCompetitorPairs = (
  a: CompetitorPair,
  b: CompetitorPair,
): -1 | 0 | 1 => {
  const aHasNull = a[0] === null || a[1] === null;
  const bHasNull = b[0] === null || b[1] === null;
  if (aHasNull && !bHasNull) {
    return 1;
  }
  if (!aHasNull && bHasNull) {
    return -1;
  }
  return 0;
};
