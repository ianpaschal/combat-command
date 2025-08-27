import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { deepenFriendship, DeepFriendship } from '../_helpers/deepenFriendship';

export const getFriendshipsByUserArgs = v.object({
  userId: v.id('users'),
});

export const getFriendshipsByUser = async (
  ctx: QueryCtx,
  args: Infer<typeof getFriendshipsByUserArgs>,
): Promise<DeepFriendship[]> => {
  // ---- CHECK AUTH ----
  await checkAuth(ctx);

  // ---- PRIMARY ACTIONS ----
  const initiatedFriendships = await ctx.db.query('friendships')
    .withIndex('by_sender_user_id', (q) => q.eq('senderUserId', args.userId).lte('confirmedAt', Date.now()))
    .collect();
  const acceptedFriendships = await ctx.db.query('friendships')
    .withIndex('by_recipient_user_id', (q) => q.eq('recipientUserId', args.userId).lte('confirmedAt', Date.now()))
    .collect();
  return await Promise.all([
    ...initiatedFriendships,
    ...acceptedFriendships,
  ].map(async (item) => await deepenFriendship(ctx, item)));
};
