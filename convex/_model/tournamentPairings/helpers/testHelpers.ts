import { RankedCompetitor } from './pairingTypes';

export const generateMockCompetitor = (
  id: string,
  opponentIds: string[],
  rank = 0,
): RankedCompetitor => ({
  id,
  opponentIds,
  rank,
} as RankedCompetitor);
