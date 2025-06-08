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

/**
 * Gets rankings and other play data for a Tournament.
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
  const { rankingFactors, gameSystemId } = await getTournamentShallow(ctx, args.tournamentId);
  if (gameSystemId !== 'flames_of_war_v4') {
    throw new ConvexError('Game systems other than Flames of War are not yet supported!');
    // TODO: Support other game systems
  }
  const {
    players,
    competitors,
  } = await aggregateFowV4TournamentData(ctx, args.tournamentId, { min: 0, max: args.round });
  return {
    players: calculateFowV4TournamentRankings(players, rankingFactors),
    competitors: calculateFowV4TournamentRankings(competitors, rankingFactors),
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
