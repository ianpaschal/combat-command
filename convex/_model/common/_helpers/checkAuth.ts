import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';

import { Id } from '../../../_generated/dataModel';
import {
  ActionCtx,
  MutationCtx,
  QueryCtx,
} from '../../../_generated/server';
import { getErrorMessage } from '../errors';

export async function checkAuth(
  ctx: QueryCtx | MutationCtx | ActionCtx,
): Promise<Id<'users'>> { 
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError(getErrorMessage('USER_NOT_AUTHENTICATED'));
  }
  return userId;
}
