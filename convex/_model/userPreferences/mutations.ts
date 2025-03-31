import { getAuthUserId } from '@convex-dev/auth/server';
import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { editableFields } from './fields';

// CRUD Operations
export const setUserPreferencesArgs = v.object({
  ...editableFields,
});

export const setUserPreferences = async (
  ctx: MutationCtx,
  args: Infer<typeof setUserPreferencesArgs>,
): Promise<void> => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError(getErrorMessage('USER_NOT_AUTHENTICATED'));
  }
  const preferences = await ctx.db.query('userPreferences').withIndex('by_user_id', (q) => q.eq('userId', userId )).first();
  if (preferences) {
    await ctx.db.patch(preferences._id, {
      ...args,
      modifiedAt: Date.now(),
    });
  } else {
    await ctx.db.insert('userPreferences', {
      ...args,
      userId,
    });
  }
};
