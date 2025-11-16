import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { getTournamentRankings } from '../../tournaments';
import { deepenTournamentCompetitor,DeepTournamentCompetitor } from '../_helpers/deepenTournamentCompetitor';

export const getTournamentCompetitorArgs = v.object({
  id: v.id('tournamentCompetitors'),
  includeRankings: v.optional(v.number()),
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

  // TODO: Replace with better tournament results objects
  const { competitors } = args.includeRankings !== undefined && args.includeRankings > -1 ? await getTournamentRankings(ctx, {
    tournamentId: tournamentCompetitor.tournamentId,
    round: args.includeRankings,
  }) : {};
  const ranking = (competitors ?? []).find((c) => c.id === args.id);

  return await deepenTournamentCompetitor(ctx, tournamentCompetitor, ranking);
};
