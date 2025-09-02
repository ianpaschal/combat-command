import { Infer, v } from 'convex/values';

import { MutationCtx } from '../../../../_generated/server';

export const deleteUserClaimTokenArgs = v.object({
  userId: v.id('users'),
});

export const deleteUserClaimToken = async (
  ctx: MutationCtx,
  args: Infer<typeof deleteUserClaimTokenArgs>,
): Promise<void> => {
  // --- CHECK AUTH ----
  // Skip, because this is an internal mutation, and the user won't be logged in yet.

  // ---- PRIMARY ACTIONS ----
  await ctx.db.patch(args.userId, {
    claimTokenHash: undefined,
  });
};
