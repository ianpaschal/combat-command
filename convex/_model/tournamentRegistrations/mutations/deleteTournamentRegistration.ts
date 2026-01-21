import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { getErrorMessage } from '../../common/errors';
import { MutationResponse } from '../../common/types';
import { getDisplayName } from '../../tournamentCompetitors';
import { getTournamentOrganizersByTournament } from '../../tournamentOrganizers';
import { getDeleteSuccessMessage } from '../_helpers/getDeleteSuccessMessage';

export const deleteTournamentRegistrationArgs = v.object({
  id: v.id('tournamentRegistrations'),
  // newCaptainUserId: v.optional(v.id('users')), // TODO
});

export const deleteTournamentRegistration = async (
  ctx: MutationCtx,
  args: Infer<typeof deleteTournamentRegistrationArgs>,
): Promise<MutationResponse> => {
  // --- CHECK AUTH ----
  const currentUserId = await checkAuth(ctx);

  // ---- REQUIRED DATA ----
  const tournamentRegistration = await ctx.db.get(args.id);
  if (!tournamentRegistration) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_REGISTRATION_NOT_FOUND'));
  }

  const { tournamentId, tournamentCompetitorId, userId } = tournamentRegistration;

  const tournament = await ctx.db.get(tournamentId);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }
  const tournamentCompetitor = await ctx.db.get(tournamentCompetitorId);
  if (!tournamentCompetitor) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_COMPETITOR_NOT_FOUND'));
  }
  const otherTournamentRegistrations = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_tournament_competitor', (q) => q.eq('tournamentCompetitorId', tournamentCompetitorId))
    .filter((q) => q.neq(q.field('userId'), userId))
    .collect();
  const tournamentOrganizers = await getTournamentOrganizersByTournament(ctx, {
    tournamentId,
  });
  const isLast = !otherTournamentRegistrations.length;
  const isCaptain = tournamentCompetitor?.captainUserId === currentUserId;
 
  // ---- VALIDATE ----
  if (tournament.status === 'archived') {
    throw new ConvexError(getErrorMessage('CANNOT_MODIFY_ARCHIVED_TOURNAMENT'));
  }
  if (tournament.status === 'active') {
    throw new ConvexError(getErrorMessage('CANNOT_REMOVE_PLAYER_FROM_ACTIVE_TOURNAMENT'));
  }
  // TODO:
  // if (wasCaptain && !args.newCaptainUserId) {

  // }

  // ---- EXTENDED AUTH CHECK ----
  /* These user IDs can make changes to this tournament registration:
   * - Tournament organizers;
   * - The user themselves;
   */
  const authorizedUserIds = [
    ...tournamentOrganizers.map((r) => r.userId),
    tournamentRegistration.userId,
  ];
  if (!authorizedUserIds.includes(currentUserId)) {
    throw new ConvexError(getErrorMessage('USER_DOES_NOT_HAVE_PERMISSION'));
  }

  // ---- PRIMARY ACTIONS ----
  // Delete the registration:
  await ctx.db.delete(tournamentRegistration._id);
  
  // If this was the last player, also delete the corresponding competitor:
  if (isLast) {
    await ctx.db.delete(tournamentRegistration.tournamentCompetitorId);
  }

  // If this was the captain, set a new captain:
  if (!isLast && isCaptain) {
    await ctx.db.patch(tournamentRegistration.tournamentCompetitorId, {
      captainUserId: otherTournamentRegistrations[0].userId,
    });
  }

  const message = await getDeleteSuccessMessage(ctx, {
    ...tournamentRegistration,
    isLast,
    teamName: await getDisplayName(ctx, tournamentCompetitor),
  });
  return {
    success: {
      message,
    },
  };
};
