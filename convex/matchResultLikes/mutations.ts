import { getAuthUserId } from '@convex-dev/auth/server';

import { mutation } from '../_generated/server';
import { fields } from '.';

/**
 * @deprecated
 */
export const addMatchResultLike = mutation({
  args: {
    ...fields,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw 'Cannot like match result while unauthenticated.';
    }
    const matchResult = await ctx.db.get(args.matchResultId);
    if (!matchResult) {
      throw 'Match result not found.';
    }
    const existingLike = await ctx.db.query('matchResultLikes').withIndex(
      'by_user_id_match_result_id',
      ((q) => q.eq('userId', userId).eq('matchResultId', args.matchResultId)),
    ).first();
    if (existingLike) {
      throw 'Match result already liked.';
    }
    return await ctx.db.insert('matchResultLikes', {
      ...args,
      userId,
    });
  },
});

/**
 * @deprecated
 */
export const removeMatchResultLike = mutation({
  args: {
    ...fields,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw 'Cannot like match result while unauthenticated.';
    }
    const matchResult = await ctx.db.get(args.matchResultId);
    if (!matchResult) {
      throw 'Match result not found.';
    }
    const existingLike = await ctx.db.query('matchResultLikes').withIndex(
      'by_user_id_match_result_id',
      ((q) => q.eq('userId', userId).eq('matchResultId', args.matchResultId)),
    ).first();
    if (!existingLike) {
      throw 'Match result is not yet liked.';
    }
    return await ctx.db.delete(existingLike._id);
  },
});

export const toggleMatchResultLike = mutation({
  args: {
    ...fields,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw 'Cannot like or unlike match result while unauthenticated.';
    }
    const matchResult = await ctx.db.get(args.matchResultId);
    if (!matchResult) {
      throw 'Match result not found.';
    }
    const existingLike = await ctx.db.query('matchResultLikes').withIndex(
      'by_user_id_match_result_id',
      ((q) => q.eq('userId', userId).eq('matchResultId', args.matchResultId)),
    ).first();
    if (existingLike) {
      return await ctx.db.delete(existingLike._id);
    }
    return await ctx.db.insert('matchResultLikes', {
      ...args,
      userId,
    });
  },
});
