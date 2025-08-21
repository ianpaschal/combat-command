import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenTournamentRegistration } from '../_helpers/deepenTournamentRegistration';
import { TournamentRegistration } from '../types';

export const getTournamentRegistrationsByUserArgs = v.object({
  userId: v.id('users'),
});

export const getTournamentRegistrationsByUser = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentRegistrationsByUserArgs>,
): Promise<TournamentRegistration[]> => {
  const tournamentRegistrations = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_user', (q) => q.eq('userId', args.userId))
    .collect();
  return await Promise.all(
    tournamentRegistrations.map(async (r) => await deepenTournamentRegistration(ctx, r)),
  );
};
