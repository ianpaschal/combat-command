import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { checkLeagueVisibility } from '../../leagues/_helpers/checkLeagueVisibility';
import { getTournamentResultsByUser } from '../../tournamentResults';
import { LeagueRankingFullResult } from '../types';

export const getLeagueRankingFullResultsArgs = v.object({
  id: v.id('leagueRankings'),
});

export const getLeagueRankingFullResults = async (
  ctx: QueryCtx,
  args: Infer<typeof getLeagueRankingFullResultsArgs>,
): Promise<LeagueRankingFullResult[]> => {
  const leagueRanking = await ctx.db.get(args.id);
  if (!leagueRanking) {
    throw new ConvexError(getErrorMessage('LEAGUE_RANKING_NOT_FOUND'));
  }
  const league = await ctx.db.get(leagueRanking.leagueId);
  if (!league || !(await checkLeagueVisibility(ctx, league))) {
    throw new ConvexError(getErrorMessage('LEAGUE_NOT_FOUND'));
  }

  const results: LeagueRankingFullResult[] = [];

  for (const tournamentId of league.tournamentIds) {
    const tournament = await ctx.db.get(tournamentId);
    const result = await getTournamentResultsByUser(ctx, {
      userId: leagueRanking.userId,
      tournamentId,
    });
    results.push({
      ...result,
      tournament: tournament ? {
        title: tournament.title,
        editionYear: tournament.editionYear,
        startsAt: tournament.startsAt,
      } : undefined,
    });
  }

  return results.sort((a, b) => (a.tournament?.startsAt ?? 0) - (b.tournament?.startsAt ?? 0));
};
