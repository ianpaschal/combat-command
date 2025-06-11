import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { checkAuth } from '../../common/_helpers/checkAuth';

export const removeTournamentCompetitorPlayerArgs = v.object({
  tournamentCompetitorId: v.id('tournamentCompetitors'),
  playerUserId: v.id('users'),
});

export const removeTournamentCompetitorPlayer = async (
  ctx: MutationCtx,
  args: Infer<typeof removeTournamentCompetitorPlayerArgs>,
): Promise<void> => {
  // --- CHECK AUTH ----
  const userId = await checkAuth(ctx);
  
  // ---- CHECK ELIGIBILITY ----
  const tournamentCompetitor = await ctx.db.get(args.tournamentCompetitorId);
  if (!tournamentCompetitor) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_COMPETITOR_NOT_FOUND'));
  }
  const tournament = await ctx.db.get(tournamentCompetitor.tournamentId);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_CONTAINING_COMPETITOR_NOT_FOUND'));
  }
  if (tournament.status === 'archived') {
    throw new ConvexError(getErrorMessage('CANNOT_MODIFY_ARCHIVED_TOURNAMENT'));
  }

  // ---- EXTENDED AUTH CHECK ----
  /* These user IDs can make changes to this tournament competitor:
   * - Tournament organizers;
   * - The user being modified;
   */
  const authorizedUserIds = [
    ...tournament.organizerUserIds,
    ...args.playerUserId,
  ];
  if (!authorizedUserIds.includes(userId)) {
    throw new ConvexError(getErrorMessage('USER_DOES_NOT_HAVE_PERMISSION'));
  }

  // ---- PRIMARY ACTIONS ----
  // If this is the last player, delete the competitor, otherwise just remove the player:
  if (tournamentCompetitor.players.length === 1) {
    await ctx.db.delete(args.tournamentCompetitorId);
  } else {
    await ctx.db.patch(args.tournamentCompetitorId, {
      players: tournamentCompetitor.players.filter((player) => player.userId !== args.playerUserId),
    });
  }
};
