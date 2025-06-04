import { RankedTournamentCompetitor } from './pairingTypes';

export const generateMockCompetitor = (
  id: string,
  opponentIds: string[],
  rank = 0,
): RankedTournamentCompetitor => ({
  id,
  opponentIds,
  rank,
} as RankedTournamentCompetitor);
