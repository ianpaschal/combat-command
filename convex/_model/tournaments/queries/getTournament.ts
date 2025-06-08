import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { checkTournamentVisibility } from '../_helpers/checkTournamentVisibility';
import { deepenTournament, TournamentDeep } from '../_helpers/deepenTournament';

export const getTournamentArgs = v.object({
  id: v.id('tournaments'),
});

/**
 * Gets a Tournament by ID.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.id - ID of the Tournament
 * @returns - A deep Tournament if found, otherwise null
 */
export const getTournament = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentArgs>,
): Promise<TournamentDeep | null> => {
  const tournament = await ctx.db.get(args.id);
  if (!tournament) {
    return null;
  }

  // --- CHECK AUTH ----
  if (await checkTournamentVisibility(ctx, tournament)) {
    return await deepenTournament(ctx, tournament);
  }
  return null;
};
