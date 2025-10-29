import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { RankingFactorValues } from '../../common/types';
import { CompetitorResult } from '../types';
import { getTournamentResultsByRound } from './getTournamentResultsByRound';

const emptyResults: CompetitorResult = {
  byeRounds: [],
  gamesPlayed: 0,
  opponentIds: [],
  playedTables: [],
  rank: -1,
  rankingFactors: {} as RankingFactorValues,
};

export const getTournamentResultsByCompetitorArgs = v.object({
  tournamentCompetitorId: v.id('tournamentCompetitors'),
  tournamentId: v.id('tournaments'),
  round: v.optional(v.number()),
});

export const getTournamentResultsByCompetitor = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentResultsByCompetitorArgs>,
): Promise<CompetitorResult> => {
  const tournamentResults = await getTournamentResultsByRound(ctx, args);
  return tournamentResults?.competitors.find((c) => c.id === args.tournamentCompetitorId) ?? emptyResults;
};
