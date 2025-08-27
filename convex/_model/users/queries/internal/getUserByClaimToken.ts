import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { Doc } from '../../../../_generated/dataModel';
import { QueryCtx } from '../../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { hashClaimToken } from '../../_helpers/hashClaimToken';

export const getUserByClaimTokenArgs = v.object({
  claimToken: v.string(),
});

export const getUserByClaimToken = async (
  ctx: QueryCtx,
  args: Infer<typeof getUserByClaimTokenArgs>,
): Promise<Doc<'users'>> => {
  const claimTokenHash = await hashClaimToken(args.claimToken);
  const user = await ctx.db.query('users')
    .withIndex('by_claimTokenHash', (q) => q.eq('claimTokenHash', claimTokenHash))
    .unique();
  if (!user) {
    throw new ConvexError(getErrorMessage('CLAIM_TOKEN_INVALID'));
  }
  return user;
};
