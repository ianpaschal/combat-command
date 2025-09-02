import { getAuthUserId } from '@convex-dev/auth/server';
import { Infer, v } from 'convex/values';

import { Id } from '../../../_generated/dataModel';
import { MutationCtx } from '../../../_generated/server';
import { editableFields } from '../table';

export const addMatchResultCommentArgs = v.object({
  ...editableFields,
});

export const addMatchResultComment = async (
  ctx: MutationCtx,
  args: Infer<typeof addMatchResultCommentArgs>,
): Promise<Id<'matchResultComments'>> => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw 'Cannot comment on match result while unauthenticated.';
  }
  return await ctx.db.insert('matchResultComments', {
    ...args,
    userId,
  });
};
