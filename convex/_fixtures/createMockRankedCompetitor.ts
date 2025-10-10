import { ExtendedRankingFactor } from '@ianpaschal/combat-command-game-systems/common';

import { Id } from '../_generated/dataModel';
import { AnyBaseStats, TournamentCompetitorRanked } from '../_model/common/types';

type CreateMockRankedCompetitorOverrides = Partial<TournamentCompetitorRanked> & {
  id: string;
  rank: number;
};

export const createMockRankedCompetitor = (
  overrides: CreateMockRankedCompetitorOverrides,
): TournamentCompetitorRanked => ({
  opponentIds: [],
  playedTables: [],
  byeRounds: [],
  gamesPlayed: 0,
  baseStats: {
    self: [],
    opponent: [],
  },
  rankingFactors: {} as Record<ExtendedRankingFactor<keyof AnyBaseStats & string>, number>,
  ...overrides,
});

export const createMockRankedCompetitors = (
  count: number,
): TournamentCompetitorRanked[] => Array.from({ length: count }, (_, i) => createMockRankedCompetitor({
  id: (`C${i + 1}`) as Id<'tournamentCompetitors'>,
  rank: i + 1,
}));
