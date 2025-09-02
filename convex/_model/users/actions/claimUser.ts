import { modifyAccountCredentials } from '@convex-dev/auth/server';
import { Infer, v } from 'convex/values';

import { internal } from '../../../_generated/api';
import { ActionCtx } from '../../../_generated/server';

export const claimUserArgs = v.object({
  claimToken: v.string(),
  password: v.string(),
});

export const claimUser = async (
  ctx: ActionCtx,
  args: Infer<typeof claimUserArgs>,
): Promise<void> => {
  // Validate the claim token:
  const user = await ctx.runQuery(internal.users.getUserByClaimToken, {
    claimToken: args.claimToken,
  });

  // Update the account password:
  await modifyAccountCredentials(ctx, {
    provider: 'password',
    account: { id: user.email, secret: args.password },
  });

  // Clean up claim token:
  // But don't do it until other steps are complete...
  await ctx.runMutation(internal.users.deleteUserClaimToken, {
    userId: user._id,
  });
};
