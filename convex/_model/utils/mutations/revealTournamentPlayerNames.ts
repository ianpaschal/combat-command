import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { VisibilityLevel } from '../../common/types';

export const revealTournamentPlayerNamesArgs = v.object({
  tournamentId: v.id('tournaments'),
});

export const revealTournamentPlayerNames = async (
  ctx: MutationCtx,
  args: Infer<typeof revealTournamentPlayerNamesArgs>,
): Promise<void> => {
  const registrations = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_tournament', (q) => q.eq('tournamentId', args.tournamentId))
    .collect();
  for (const registration of registrations) {
    const { userId } = registration;
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new ConvexError(getErrorMessage('USER_NOT_FOUND'));
    }
    if (user.nameVisibility < VisibilityLevel.Tournaments) {
      await ctx.db.patch(userId, {
        nameVisibility: VisibilityLevel.Tournaments,
      });
    }
  }
};
