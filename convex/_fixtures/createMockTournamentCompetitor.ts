import { Id } from '../_generated/dataModel';
import { RankingFactorValues } from '../_model/common/types';
import { DeepTournamentCompetitor } from '../_model/tournamentCompetitors';

type Overrides = Partial<Omit<DeepTournamentCompetitor, '_id'|'_creationTime'>> & {
  id: string;
};

export const createMockTournamentCompetitor = (
  overrides: Overrides,
): DeepTournamentCompetitor => ({
  _creationTime: Date.now(),
  byeRounds: [],
  gamesPlayed: 0,
  opponentIds: [],
  playedTables: [],
  rank: -1,
  rankingFactors: {} as RankingFactorValues,
  registrations: [],
  tournamentId: 'T0' as Id<'tournaments'>,
  ...overrides,
  _id: overrides.id as Id<'tournamentCompetitors'>,
  activeRegistrationCount: 0,
  availableActions: [],
});

export const createMockTournamentCompetitors = (
  count: number,
): DeepTournamentCompetitor[] => Array.from({ length: count }, (_, i) => createMockTournamentCompetitor({
  id: `C${i}`,
  rank: i,
}));
