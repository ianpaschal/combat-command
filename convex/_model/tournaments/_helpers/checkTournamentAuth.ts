import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { TournamentShallow } from './getTournamentShallow';

export const checkTournamentAuth = async (
  ctx: QueryCtx,
  tournament: TournamentShallow, // TODO: Make union with TournamentDeep
) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError(getErrorMessage('USER_NOT_AUTHENTICATED'));
  }
  if (!tournament.organizerUserIds.includes(userId)) {
    throw new ConvexError(getErrorMessage('USER_NOT_TOURNAMENT_ORGANIZER'));
  }
};
