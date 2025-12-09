import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { getErrorMessage } from '../../common/errors';
import { getTournamentOrganizersByTournament } from '../../tournamentOrganizers';
import { editableFields } from '../table';

export const updateTournamentCompetitorArgs = v.object({
  id: v.id('tournamentCompetitors'),
  ...editableFields,
});

export const updateTournamentCompetitor = async (
  ctx: MutationCtx,
  args: Infer<typeof updateTournamentCompetitorArgs>,
): Promise<void> => {
  const { id, ...updated } = args;
  // --- CHECK AUTH ----
  const userId = await checkAuth(ctx);
    
  // ---- VALIDATE ----
  const tournamentCompetitor = await ctx.db.get(id);
  if (!tournamentCompetitor) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_COMPETITOR_NOT_FOUND'));
  }
  const tournament = await ctx.db.get(tournamentCompetitor.tournamentId);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }
  if (tournament.status === 'archived') {
    throw new ConvexError(getErrorMessage('CANNOT_MODIFY_ARCHIVED_TOURNAMENT'));
  }

  // ---- EXTENDED AUTH CHECK ----
  /* These user IDs can make changes to this tournament competitor:
   * - Tournament organizers;
   * - This tournament competitor's captain;
   */
  const tournamentOrganizers = await getTournamentOrganizersByTournament(ctx, {
    tournamentId: tournamentCompetitor.tournamentId,
  });
  const authorizedUserIds = [
    ...tournamentOrganizers.map((r) => r.userId),
    tournamentCompetitor.captainUserId,
  ];
  if (!authorizedUserIds.includes(userId)) {
    throw new ConvexError(getErrorMessage('USER_DOES_NOT_HAVE_PERMISSION'));
  }

  // ---- PRIMARY ACTIONS ----
  await ctx.db.patch(id, {
    ...updated,
    modifiedAt: Date.now(),
  });
};
