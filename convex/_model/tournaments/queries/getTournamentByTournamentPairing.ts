import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenTournament, TournamentDeep } from '../_helpers/deepenTournament';

export const getTournamentByTournamentPairingArgs = v.object({
  tournamentPairingId: v.id('tournamentPairings'),
});

export const getTournamentByTournamentPairing = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentByTournamentPairingArgs>,
): Promise<TournamentDeep | null> => {
  const tournamentPairing = await ctx.db.get(args.tournamentPairingId);
  if (!tournamentPairing) {
    return null;
  }
  const tournament = await ctx.db.get(tournamentPairing.tournamentId);
  if (!tournament) {
    return null;
  }
  return await deepenTournament(ctx, tournament);
};
