import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { getTournamentShallow } from '../_helpers/getTournamentShallow';

export const getTournamentOpenRoundArgs = v.object({
  id: v.id('tournaments'),
});

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Gets the current open round for a Tournament, including its match submission progress.
 *
 * @remarks
 * This method's return type is, by nature, the definition of a tournament rankings.
 *
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.id - ID of the Tournament
 * @returns 
 */
export const getTournamentOpenRound = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentOpenRoundArgs>,
) => {
  const tournament = await getTournamentShallow(ctx, args.id);
  
  if (tournament.status !== 'active' || tournament.currentRound === undefined) {
    return null;
  }
  const tournamentPairings = await ctx.db.query('tournamentPairings')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', args.id))
    .filter((q) => q.eq(q.field('round'), tournament.currentRound))
    .collect();
  const matchResults = await ctx.db.query('matchResults')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', args.id))
    .order('desc')
    .collect();
  const filteredMatchResults = matchResults.filter((result) => (
    !!tournamentPairings.find((item) => item._id === result.tournamentPairingId)
  ));
  const required = tournamentPairings.length * tournament.competitorSize;
  const submitted = filteredMatchResults.length;

  return {
    round: tournament.currentRound,
    matchResultsProgress: {
      required,
      submitted,
      remaining: Math.max(0, required - submitted),
    },
    // TODO: Get timer
  };
};

/**
 * Tournament open round data, including match submission progress.
 */
export type TournamentOpenRound = Awaited<ReturnType<typeof getTournamentOpenRound>>;
