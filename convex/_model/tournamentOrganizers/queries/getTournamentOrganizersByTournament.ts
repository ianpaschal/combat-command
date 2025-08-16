import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenTournamentOrganizer, DeepTournamentOrganizer } from '../_helpers/deepenTournamentOrganizer';

export const getTournamentOrganizersByTournamentArgs = v.object({
  tournamentId: v.id('tournaments'),
  deepen: v.optional(v.boolean()),
});

export const getTournamentOrganizersByTournament = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentOrganizersByTournamentArgs>,
): Promise<DeepTournamentOrganizer[]> => {
  const records = await ctx.db.query('tournamentOrganizers')
    .withIndex('by_tournament', (q) => q.eq('tournamentId', args.tournamentId))
    .collect();
  if (args.deepen) {
    return await Promise.all(records.map(async (item) => (
      await deepenTournamentOrganizer(ctx, item)
    )));
  }
  return records;
};
