import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenTournamentRegistration } from '../_helpers/deepenTournamentRegistration';
import { TournamentRegistration } from '../types';

export const getTournamentRegistrationByTournamentUserArgs = v.object({
  tournamentId: v.id('tournaments'),
  userId: v.id('users'),
});

export const getTournamentRegistrationByTournamentUser = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentRegistrationByTournamentUserArgs>,
): Promise<TournamentRegistration | null> => {
  const doc = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_tournament_user', (q) => q.eq('tournamentId', args.tournamentId).eq('userId', args.userId))
    .unique();
  if (!doc) {
    return null;
  }
  return await deepenTournamentRegistration(ctx, doc);
};
