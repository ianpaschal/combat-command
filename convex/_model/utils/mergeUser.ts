import { getAuthUserId } from '@convex-dev/auth/server';
import { Infer, v } from 'convex/values';

import { MutationCtx } from '../../_generated/server';

export const mergeUserArgs = v.object({
  primaryId: v.id('users'),
  secondaryId: v.id('users'),
});

/**
 * Merges a secondary user into a primary user.
 * 
 * @param ctx - Convex query context
 * @param args - User data
 */
export const mergeUser = async (
  ctx: MutationCtx,
  args: Infer<typeof mergeUserArgs>,
): Promise<void> => {
  
  // --- CHECK AUTH ----
  // TODO: This should be admin roles or something
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error('Auth required');
  }

  // ---- PRIMARY ACTIONS ----
  // Match Result Comments
  const matchResultComments = await ctx.db.query('matchResultComments')
    .withIndex('by_user_id', (q) => q.eq('userId', args.secondaryId))
    .collect();
  for (const record of matchResultComments) {
    await ctx.db.patch(record._id, { userId: args.primaryId });
  }

  // Match Result Likes
  const matchResultLikes = await ctx.db.query('matchResultLikes')
    .withIndex('by_user_id', (q) => q.eq('userId', args.secondaryId))
    .collect();
  for (const record of matchResultLikes) {
    await ctx.db.patch(record._id, { userId: args.primaryId });
  }

  // Match Results
  const matchResults = await ctx.db.query('matchResults')
    .filter((q) => q.or(
      q.eq(q.field('player0UserId'), args.secondaryId),
      q.eq(q.field('player1UserId'), args.secondaryId),
    ))
    .collect();
  for (const record of matchResults) {
    if (record.player0UserId === args.secondaryId) {
      await ctx.db.patch(record._id, { player0UserId: args.primaryId });
    }
    if (record.player1UserId === args.secondaryId) {
      await ctx.db.patch(record._id, { player1UserId: args.primaryId });
    }
  }

  // Tournament Registrations
  const tournamentRegistrations = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_user', (q) => q.eq('userId', args.secondaryId))
    .collect();
  for (const record of tournamentRegistrations) {
    await ctx.db.patch(record._id, {
      userId: args.primaryId,
    });
  }
  
  // Tournament Organizers
  const tournamentOrganizers = await ctx.db.query('tournamentOrganizers')
    .withIndex('by_user', (q) => q.eq('userId', args.secondaryId))
    .collect();
  for (const record of tournamentOrganizers) {
    await ctx.db.patch(record._id, {
      userId: args.primaryId,
    });
  }

  // Friendships
  const friendships = await ctx.db.query('friendships')
    .filter((q) => q.or(
      q.eq(q.field('senderUserId'), args.secondaryId),
      q.eq(q.field('recipientUserId'), args.secondaryId),
    ))
    .collect();
  for (const record of friendships) {
    if (record.senderUserId === args.secondaryId) {
      await ctx.db.patch(record._id, { senderUserId: args.primaryId });
    }
    if (record.recipientUserId === args.secondaryId) {
      await ctx.db.patch(record._id, { recipientUserId: args.primaryId });
    }
  }

  // Clean up the loose ID
  await ctx.db.delete(args.secondaryId);
};
