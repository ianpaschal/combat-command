import { v } from 'convex/values';

import { Doc } from '../_generated/dataModel';
import { query, QueryCtx } from '../_generated/server';
import { getLimitedUser } from '../users/utils/getLimitedUser';

export const joinUsersToLike = async (ctx: QueryCtx, like: Doc<'matchResultLikes'>) => {
  const user = await getLimitedUser(ctx, like.userId);
  if (!user) {
    throw Error('Could not find user!');
  }
  return {
    ...like,
    user,
  };
};

export const getMatchResultLike = query({
  args: {
    id: v.id('matchResultLikes'),
  },
  handler: async (ctx, args) => {
    const like = await ctx.db.get(args.id);
    if (!like) {
      throw Error('Could not find like!');
    }
    return await joinUsersToLike(ctx, like);
  },
});

export const getMatchResultLikesByMatchResultId = query({
  args: {
    matchResultId: v.id('matchResults'),
  },
  handler: async (ctx, args) => {
    const likes = await ctx.db.query('matchResultLikes').withIndex(
      'by_match_result_id',
      ((q) => q.eq('matchResultId', args.matchResultId)),
    ).order('desc').collect();
    return await Promise.all(likes.map((like) => joinUsersToLike(ctx, like)));
  },
});

export const getMatchResultLikesByUserId = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const likes = await ctx.db.query('matchResultLikes').withIndex(
      'by_user_id',
      ((q) => q.eq('userId', args.userId)),
    ).order('desc').collect();
    return await Promise.all(likes.map((like) => joinUsersToLike(ctx, like)));
  },
});
