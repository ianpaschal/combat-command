import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { checkAuth } from '../../common/_helpers/checkAuth';

export const deleteTournamentOrganizerArgs = v.object({
  id: v.id('tournamentOrganizers'),
});

export const deleteTournamentOrganizer = async (
  ctx: MutationCtx,
  args: Infer<typeof deleteTournamentOrganizerArgs>,
): Promise<void> => {
  // --- CHECK AUTH ----
  const userId = await checkAuth(ctx);

  const tournamentOrganizer = await ctx.db.get(args.id);
  if (!tournamentOrganizer) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_REGISTRATION_NOT_FOUND'));
  }

  // ---- VALIDATE ----
  const tournamentOrganizers = await ctx.db.query('tournamentOrganizers')
    .withIndex('by_tournament', (q) => q.eq('tournamentId', tournamentOrganizer.tournamentId))
    .collect();
  if (tournamentOrganizers.length === 1) {
    throw new ConvexError(getErrorMessage('CANNOT_REMOVE_LAST_ORGANIZER_FROM_TOURNAMENT'));
  }

  // ---- EXTENDED AUTH CHECK ----
  /* These user IDs can make changes to this tournament tournamentOrganizer:
   * - Tournament owners;
   * - The user themselves;
   */
  const authorizedUserIds = [
    ...tournamentOrganizers.filter((to) => to.isOwner).map((to) => to.userId),
    tournamentOrganizer.userId,
  ];
  if (!authorizedUserIds.includes(userId)) {
    throw new ConvexError(getErrorMessage('USER_DOES_NOT_HAVE_PERMISSION'));
  }

  // ---- PRIMARY ACTIONS ----
  // Delete the tournamentOrganizer:
  await ctx.db.delete(tournamentOrganizer._id);
};
