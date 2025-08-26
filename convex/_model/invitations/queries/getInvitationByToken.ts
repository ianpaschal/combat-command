import { Infer, v } from 'convex/values';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { sha256Hex } from '../_helpers/sha256Hex';

export const getInvitationByTokenArgs = v.object({
  token: v.string(),
});

export const getInvitationByToken = async (
  ctx: QueryCtx,
  args: Infer<typeof getInvitationByTokenArgs>,
): Promise<Doc<'invitations'>> => {
  const secret = await sha256Hex(args.token);
  const invitation = await ctx.db.query('invitations')
    .withIndex('by_secret', (q) => q.eq('secret', secret))
    .unique();
  if (!invitation) {
    throw new Error('Invalid or expired invitation');
  }
  return invitation;
};
