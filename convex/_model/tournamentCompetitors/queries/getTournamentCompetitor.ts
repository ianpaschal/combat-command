import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenTournamentCompetitor,DeepTournamentCompetitor } from '../_helpers/deepenTournamentCompetitor';

export const getTournamentCompetitorArgs = v.object({
  id: v.id('tournamentCompetitors'),
});

/**
 * Gets a tournament competitor by ID.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.id - ID of the tournament competitor
 * @returns - A deep tournament competitor if found, otherwise null
 */
export const getTournamentCompetitor = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentCompetitorArgs>,
): Promise<DeepTournamentCompetitor | null> => {
  const tournamentCompetitor = await ctx.db.get(args.id);
  if (!tournamentCompetitor) {
    return null;
  }
  return await deepenTournamentCompetitor(ctx, tournamentCompetitor);
};
