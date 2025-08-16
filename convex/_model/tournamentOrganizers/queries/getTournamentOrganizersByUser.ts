import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenTournamentOrganizer, DeepTournamentOrganizer } from '../_helpers/deepenTournamentOrganizer';

export const getTournamentOrganizersByUserArgs = v.object({
  userId: v.id('users'),
  deepen: v.optional(v.boolean()),
});

export const getTournamentOrganizersByUser = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentOrganizersByUserArgs>,
): Promise<DeepTournamentOrganizer[]> => {
  const records = await ctx.db.query('tournamentOrganizers')
    .withIndex('by_user', (q) => q.eq('userId', args.userId))
    .collect();
  if (args.deepen) {
    return await Promise.all(records.map(async (item) => (
      await deepenTournamentOrganizer(ctx, item)
    )));
  }
  return records;
};
