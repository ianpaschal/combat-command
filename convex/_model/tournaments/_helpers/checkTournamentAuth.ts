import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';

/**
 * Checks if a user has permission to perform actions on a Tournament.
 * Throws an error if:
 *   - The user is not authenticated;
 *   - The user is not an organizer of the Tournament;
 * 
 * @param ctx - Convex query context
 * @param tournament - Raw Tournament document
 */
export const checkTournamentAuth = async (
  ctx: QueryCtx,
  tournament: Doc<'tournaments'>, // TODO: Make union with TournamentDeep
): Promise<void> => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError(getErrorMessage('USER_NOT_AUTHENTICATED'));
  }
  if (!tournament.organizerUserIds.includes(userId)) {
    throw new ConvexError(getErrorMessage('USER_NOT_TOURNAMENT_ORGANIZER'));
  }
};
