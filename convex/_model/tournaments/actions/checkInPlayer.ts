import { getAuthUserId } from '@convex-dev/auth/server';
import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';

export const checkInPlayerArgs = v.object({
  tournamentCompetitorId: v.id('tournamentCompetitors'),
  playerUserId: v.id('users'),
});

export const checkInPlayer = async (
  ctx: MutationCtx,
  args: Infer<typeof checkInPlayerArgs>,
) => {
  const tournamentCompetitor = await ctx.db.get(args.tournamentCompetitorId);
  if (!tournamentCompetitor) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_COMPETITOR_NOT_FOUND'));
  }
  const tournament = await ctx.db.get(tournamentCompetitor.tournamentId);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError(getErrorMessage('USER_NOT_AUTHENTICATED'));
  }
  if (!tournament.organizerUserIds.includes(userId)) {
    throw new ConvexError(getErrorMessage('USER_NOT_TOURNAMENT_ORGANIZER'));
  }
  const playerIndex = tournamentCompetitor.players.findIndex((player) => player.userId === args.playerUserId);
  if (playerIndex === -1) {
    throw new ConvexError(getErrorMessage('USER_NOT_TOURNAMENT_PLAYER'));
  }
  
  return await ctx.db.patch(args.tournamentCompetitorId, {
    players: [
      ...tournamentCompetitor.players.slice(0, playerIndex),
      {
        userId: args.playerUserId,
        active: true,
      },
      ...tournamentCompetitor.players.slice(playerIndex + 1),
    ],
  });
};
