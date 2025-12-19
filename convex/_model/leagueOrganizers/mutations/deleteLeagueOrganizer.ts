import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { getErrorMessage } from '../../common/errors';

export const deleteLeagueOrganizerArgs = v.object({
  id: v.id('leagueOrganizers'),
});

export const deleteLeagueOrganizer = async (
  ctx: MutationCtx,
  args: Infer<typeof deleteLeagueOrganizerArgs>,
): Promise<void> => {
  // --- CHECK AUTH ----
  const userId = await checkAuth(ctx);

  const leagueOrganizer = await ctx.db.get(args.id);
  if (!leagueOrganizer) {
    throw new ConvexError(getErrorMessage('LEAGUE_ORGANIZER_NOT_FOUND'));
  }

  // ---- VALIDATE ----
  const leagueOrganizers = await ctx.db.query('leagueOrganizers')
    .withIndex('by_league', (q) => q.eq('leagueId', leagueOrganizer.leagueId))
    .collect();
  if (leagueOrganizers.length === 1) {
    throw new ConvexError(getErrorMessage('CANNOT_REMOVE_LAST_ORGANIZER_FROM_LEAGUE'));
  }

  // ---- EXTENDED AUTH CHECK ----
  /* These user IDs can make changes to this league leagueOrganizer:
   * - League owners;
   */
  const authorizedUserIds = leagueOrganizers.map((to) => to.userId);
  if (!authorizedUserIds.includes(userId)) {
    throw new ConvexError(getErrorMessage('USER_DOES_NOT_HAVE_PERMISSION'));
  }

  // ---- PRIMARY ACTIONS ----
  // Delete the leagueOrganizer:
  await ctx.db.delete(leagueOrganizer._id);
};
