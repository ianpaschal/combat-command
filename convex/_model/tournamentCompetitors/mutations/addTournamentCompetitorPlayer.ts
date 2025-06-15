import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { getTournamentUserIds } from '../../tournaments';

export const addTournamentCompetitorPlayerArgs = v.object({
  tournamentCompetitorId: v.id('tournamentCompetitors'),
  playerUserId: v.id('users'),
});

export const addTournamentCompetitorPlayer = async (
  ctx: MutationCtx,
  args: Infer<typeof addTournamentCompetitorPlayerArgs>,
): Promise<void> => {
  // --- CHECK AUTH ----
  const userId = await checkAuth(ctx);

  // ---- VALIDATE ----
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
  const registeredUserIds = await getTournamentUserIds(ctx, tournamentCompetitor.tournamentId);
  if (registeredUserIds.includes(args.playerUserId)) {
    throw new ConvexError(getErrorMessage('USER_ALREADY_IN_TOURNAMENT'));
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
  await ctx.db.patch(args.tournamentCompetitorId, {
    players: [
      ...tournamentCompetitor.players,
      {
        userId: args.playerUserId,
        active: true,
      },
    ],
  });
};
