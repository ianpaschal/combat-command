import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { aggregateTournamentData } from '../../common/_helpers/gameSystem/aggregateTournamentData';
import { createSortByRanking } from '../../common/_helpers/gameSystem/createSortByRanking';
import { TournamentCompetitorRanked, TournamentPlayerRanked } from '../../common/types';
import { applyScoreAdjustments } from '../_helpers/applyScoreAdjustments';
import { getTournamentShallow } from '../_helpers/getTournamentShallow';

export type TournamentRankings = {
  players: TournamentPlayerRanked[];
  competitors: TournamentCompetitorRanked[];
};

export const getTournamentRankingsArgs = v.object({
  tournamentId: v.id('tournaments'),
  round: v.number(),
});

/**
 * Gets rankings and other play data for a tournament.
 *
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.tournamentId - ID of the Tournament
 * @param args.round - Round index up to which to include data
 * @returns - A TournamentRankings object
 */
export const getTournamentRankings = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentRankingsArgs>,
): Promise<TournamentRankings> => {

  // ---- GATHER DATABASE RECORDS ----
  const { gameSystem, rankingFactors } = await getTournamentShallow(ctx, args.tournamentId);
  const tournamentRegistrations = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_tournament', (q) => q.eq('tournamentId', args.tournamentId))
    .collect();
  const tournamentCompetitors = await ctx.db.query('tournamentCompetitors')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', args.tournamentId))
    .collect();
  const tournamentPairings = await ctx.db.query('tournamentPairings')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', args.tournamentId))
    .filter((q) => q.and(q.gte(q.field('round'), 0), q.lte(q.field('round'), args.round)))
    .collect();
  const relevantTournamentPairingIds = tournamentPairings.map((r) => r._id);
  const matchResults = await ctx.db.query('matchResults')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', args.tournamentId))
    .collect();
  const relevantMatchResults = matchResults.filter((r) => (
    r.tournamentPairingId && relevantTournamentPairingIds.includes(r.tournamentPairingId)
  ));

  // ---- AGGREGATE RANKING DATA ----
  const { registrations, competitors } = aggregateTournamentData(gameSystem, {
    tournamentRegistrations,
    tournamentCompetitors,
    tournamentPairings,
    matchResults: relevantMatchResults,
  });

  // ---- APPLY SCORE ADJUSTMENTS ----
  const adjustedCompetitors = competitors.map((c) => {
    const competitor = tournamentCompetitors.find((w) => w._id === c.id);
    const adjustedRankingFactors = applyScoreAdjustments(
      c.rankingFactors,
      competitor?.scoreAdjustments ?? [],
      args.round,
    );
    return {
      ...c,
      rankingFactors: adjustedRankingFactors,
    };
  });

  // ---- SORT USING RANKING FACTORS ----
  const sortByRanking = createSortByRanking(gameSystem, rankingFactors);
  return {
    players: registrations.sort(sortByRanking).map((data, i) => ({
      ...data,
      rank: i,
    })),
    competitors: adjustedCompetitors.sort(sortByRanking).map((data, i) => ({
      ...data,
      rank: i,
    })),
  };
};
