import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { getTournamentShallow } from '../_helpers/getTournamentShallow';

export const getTournamentOpenRoundArgs = v.object({
  id: v.id('tournaments'),
});

export const getTournamentOpenRound = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentOpenRoundArgs>,
) => {
  const tournament = await getTournamentShallow(ctx, args.id);
  
  if (tournament.status !== 'active' || tournament.currentRound === undefined) {
    return null;
  }

  const pairings = await ctx.db.query('tournamentPairings')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', args.id))
    .filter((q) => q.eq(q.field('round'), tournament.currentRound))
    .collect();

  const matchResults = await ctx.db.query('matchResults')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', args.id))
    .collect();

  const relevantPairingIds = pairings.map((pairing) => pairing._id);
  const relevantMatchResultIds = matchResults.filter((matchResult) => (
    matchResult.tournamentPairingId && relevantPairingIds.includes(matchResult.tournamentPairingId)
  )).map((matchResult) => matchResult._id);

  return {
    round: tournament.currentRound,
    matchResultsProgress: {
      submitted: relevantPairingIds.length * tournament.competitorSize,
      required: relevantMatchResultIds.length,
    },
    // TODO: Get timer
  };
};
