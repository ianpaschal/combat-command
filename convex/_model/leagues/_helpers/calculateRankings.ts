import { ConvexError } from 'convex/values';

import { Doc, Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { createSortByRanking } from '../../common/_helpers/gameSystem/createSortByRanking';
import { getErrorMessage } from '../../common/errors';
import { RankingFactor } from '../../common/types';
import { LeagueRankingInput } from '../../leagueRankings/types';
import { getTournamentResultsByRound } from '../../tournamentResults';

export const calculateRankings = async (
  ctx: QueryCtx,
  league: Doc<'leagues'>,
): Promise<LeagueRankingInput[]> => {

  const userResults: Record<Id<'users'>, { rankingFactors: Record<RankingFactor, number> }[]> = {};

  // For each tournament in the league:
  for (const tournamentId of league.tournamentIds ?? []) {

    const tournament = await ctx.db.get(tournamentId);
    if (!tournament) {
      throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
    }

    // If archived, retrieve results:
    if (tournament.status === 'archived') {
      const tournamentResult = await getTournamentResultsByRound(ctx, {
        tournamentId,
        round: tournament.lastRound ?? 0,
      });
      if (!tournamentResult) {
        continue;
      }

      // Within the results, for each registration, add those results to the user result map:
      for (const { id, rankingFactors } of tournamentResult.registrations) {
        const reg = await ctx.db.get(id);
        if (!reg) {
          throw new ConvexError(getErrorMessage('TOURNAMENT_REGISTRATION_NOT_FOUND'));
        }
        const { userId } = reg;
        if (!userResults[userId]) {
          userResults[userId] = [];
        }
        userResults[userId].push({ rankingFactors });
      }
    }
  }

  // Sorting algorithm for this league's ranking factors:
  const sortByRankingFactors = createSortByRanking(league.gameSystem, league.rankingFactors);

  const rankings: LeagueRankingInput[] = [];

  // Process each users aggregate results and sort/rank them:
  for (const [userId, results] of Object.entries(userResults)) {

    // Skip users who do not meet the participation threshold:
    if (results.length < league.participationThreshold) {
      continue;
    }

    // Sort each user's results from best-to-worst using league ranking factors.
    // Take the best N results where N is the league's participation threshold.
    const aggregateResults = results.sort(sortByRankingFactors).slice(0, league.limitResults || undefined).reduce((acc, { rankingFactors }) => {
      Object.entries(rankingFactors).forEach(([key, value]) => {
        acc[key as RankingFactor] = (acc[key as RankingFactor] ?? 0) + value;
      });
      return acc;
    }, {} as Record<RankingFactor, number>);

    // Divide average-based ranking factors by the participation threshold:
    Object.entries(aggregateResults).forEach(([key, value]) => {
      if (key.includes('average')) {
        aggregateResults[key as RankingFactor] = value / league.participationThreshold;
      }
    });

    // Add the user's results to an array which can be sorted and ranked:
    rankings.push({
      leagueId: league._id,
      userId: userId as Id<'users'>,
      rank: -1,
      rankingFactors: aggregateResults,
      tournamentCount: results.length,
    });
  }

  // Process each users aggregate results and sort/rank them:
  return rankings.sort(sortByRankingFactors).map((r, i) => ({ ...r, rank: i }));
};
