import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { Id } from '../../../_generated/dataModel';
import { MutationCtx } from '../../../_generated/server';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { getErrorMessage } from '../../common/errors';
import { getTournamentOrganizersByTournament } from '../queries/getTournamentOrganizersByTournament';
import { editableFields } from '../table';

export const createTournamentOrganizerArgs = v.object({
  ...editableFields,
});

export const createTournamentOrganizer = async (
  ctx: MutationCtx,
  args: Infer<typeof createTournamentOrganizerArgs>,
): Promise<Id<'tournamentOrganizers'>> => {
  // --- CHECK AUTH ----
  const userId = await checkAuth(ctx);

  // ---- VALIDATE ----
  const tournament = await ctx.db.get(args.tournamentId);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }
  const tournamentOrganizers = await getTournamentOrganizersByTournament(ctx, {
    tournamentId: tournament._id,
  });
  if (tournamentOrganizers.find((to) => to.userId === args.userId)) {
    throw new ConvexError(getErrorMessage('USER_ALREADY_ORGANIZER'));
  }

  // ---- EXTENDED AUTH CHECK ----
  /* These user IDs can make changes to this tournament organizer:
   * - Tournament organizers;
   */
  const authorizedUserIds = [
    ...tournamentOrganizers.map((to) => to.userId),
    ...(tournamentOrganizers.length === 0 ? [args.userId] : []),
  ];
  if (!authorizedUserIds.includes(userId)) {
    throw new ConvexError(getErrorMessage('USER_DOES_NOT_HAVE_PERMISSION'));
  }

  // ---- PRIMARY ACTIONS ----
  return await ctx.db.insert('tournamentOrganizers', {
    ...args,
  });
};
