import { Infer, v } from 'convex/values';

import { MutationCtx } from '../../../_generated/server';

export const deleteMatchResultsByTournamentRoundArgs = v.object({
  tournamentId: v.id('tournaments'),
  round: v.number(),
});

export const deleteMatchResultsByTournamentRound = async (
  ctx: MutationCtx,
  args: Infer<typeof deleteMatchResultsByTournamentRoundArgs>,
): Promise<void> => {
  const tournamentPairings = await ctx.db.query('tournamentPairings')
    .withIndex('by_tournament_round', (q) => q.eq('tournamentId', args.tournamentId).eq('round', args.round))
    .collect();
  const tournamentPairingIds = tournamentPairings.map((r) => r._id);
  const matchResults = await ctx.db.query('matchResults')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', args.tournamentId))
    .order('desc')
    .collect();
  for (const { _id, tournamentPairingId } of matchResults) {
    if (tournamentPairingId && tournamentPairingIds.includes(tournamentPairingId)) {
      await ctx.db.delete(_id);
    }
  }
};
