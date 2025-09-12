import { GameSystem } from '@ianpaschal/combat-command-static-data/common';
import { RankingFactor } from '@ianpaschal/combat-command-static-data/flamesOfWarV4';
import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { aggregateFowV4TournamentData } from '../../fowV4/aggregateFowV4TournamentData';
import { calculateFowV4TournamentRankings } from '../../fowV4/calculateFowV4TournamentRankings';
import { getTournamentShallow } from '../_helpers/getTournamentShallow';

export const getTournamentRankingsArgs = v.object({
  tournamentId: v.id('tournaments'),
  round: v.number(),
});

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Gets rankings and other play data for a tournament.
 *
 * @remarks
 * This method's return type is, by nature, the definition of tournament rankings.
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
) => {
  // ---- GATHER BASE DATA ----
  const { rankingFactors, gameSystem } = await getTournamentShallow(ctx, args.tournamentId);
  const tournamentRegistrations = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_tournament', (q) => q.eq('tournamentId', args.tournamentId))
    .collect();
  const tournamentCompetitors = await ctx.db.query('tournamentCompetitors')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', args.tournamentId))
    .collect();
  const tournamentPairings = await ctx.db.query('tournamentPairings')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', args.tournamentId))
    .collect();
  const matchResults = await ctx.db.query('matchResults')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', args.tournamentId))
    .collect();

  // TODO: Support other game systems
  if (gameSystem !== GameSystem.FlamesOfWarV4) {
    throw new ConvexError('Game systems other than Flames of War are not yet supported!');
  }
  const {
    players,
    competitors,
  } = aggregateFowV4TournamentData(ctx, {
    tournamentRegistrations,
    tournamentCompetitors,
    tournamentPairings,
    matchResults,
  }, { min: 0, max: args.round });

  // Apply score adjustments to competitors:
  const adjustedCompetitors = competitors.map((v) => {
    const competitor = tournamentCompetitors.find((w) => w._id === v.id);
    const adjustments = (competitor?.scoreAdjustments ?? []).reduce((acc, w) => ({
      ...acc,
      [w.rankingFactor]: (w.rankingFactor ?? 0) + w.amount,
    }), {} as Partial<Record<RankingFactor, number>>);
    return {
      ...v,
      stats: Object.entries(v.stats).reduce((acc, [rankingFactor, value]) => ({
        ...acc,
        [rankingFactor]: value + (adjustments[rankingFactor as RankingFactor] ?? 0),
      }), {} as Record<RankingFactor, number>),
    };
  });

  return {
    players: calculateFowV4TournamentRankings(players, rankingFactors),
    competitors: calculateFowV4TournamentRankings(adjustedCompetitors, rankingFactors),
  };
};

/**
 * Tournament rankings and related data, split into competitors and players.
 */
export type TournamentRankings = Awaited<ReturnType<typeof getTournamentRankings>>;

/**
 * Ranked TournamentCompetitor with additional stats and related data.
 */
export type TournamentCompetitorRanked = TournamentRankings['competitors'][number];

/**
 * Ranked Tournament player with additional stats and related data.
 */
export type TournamentPlayerRanked = TournamentRankings['competitors'][number];
