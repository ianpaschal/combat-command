import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { notNullOrUndefined } from '../../common/_helpers/notNullOrUndefined';
import { deepenTournamentRegistration, DeepTournamentRegistration } from '../_helpers/deepenTournamentRegistration';

export const getTournamentRegistrationsByUserArgs = v.object({
  userId: v.id('users'),
});

export const getTournamentRegistrationsByUser = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentRegistrationsByUserArgs>,
): Promise<DeepTournamentRegistration[]> => {
  const tournamentRegistrations = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_user', (q) => q.eq('userId', args.userId))
    .collect();
  const deepTournamentRegistrations = await Promise.all(
    tournamentRegistrations.map(async (r) => await deepenTournamentRegistration(ctx, r)),
  );
  return deepTournamentRegistrations.filter(notNullOrUndefined);
};
