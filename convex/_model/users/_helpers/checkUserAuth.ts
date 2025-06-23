import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';

/**
 * Checks if a user has permission to perform actions on a user.
 * Throws an error if:
 *   - The user is not authenticated;
 *   - The user is attempting to edit another user;
 * 
 * @param ctx - Convex query context
 * @param user - Raw user document
 */
export const checkUserAuth = async (
  ctx: QueryCtx,
  user: Doc<'users'>, // TODO: Make union with TournamentDeep
): Promise<void> => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError(getErrorMessage('USER_NOT_AUTHENTICATED'));
  }
  if (userId !== user._id) {
    throw new ConvexError(getErrorMessage('USER_DOES_NOT_HAVE_PERMISSION'));
  }
};
