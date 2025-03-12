import { v } from 'convex/values';

import { Doc } from '../_generated/dataModel';
import { query, QueryCtx } from '../_generated/server';
import { getLimitedUser } from '../users/utils/getLimitedUser';

export const joinUsersToComment = async (ctx: QueryCtx, comment: Doc<'matchResultComments'>) => {
  const user = await getLimitedUser(ctx, comment.userId);
  if (!user) {
    throw Error('Could not find user!');
  }
  return {
    ...comment,
    user,
  };
};

export const getMatchResultComment = query({
  args: {
    id: v.id('matchResultComments'),
  },
  handler: async (ctx, args) => {
    const comment = await ctx.db.get(args.id);
    if (!comment) {
      throw Error('Could not find comment!');
    }
    return await joinUsersToComment(ctx, comment);
  },
});

export const getMatchResultCommentsByMatchResultId = query({
  args: {
    matchResultId: v.id('matchResults'),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db.query('matchResultComments').withIndex(
      'by_match_result_id',
      ((q) => q.eq('matchResultId', args.matchResultId)),
    ).order('desc').collect();
    return await Promise.all(comments.map((comment) => joinUsersToComment(ctx, comment)));
  },
});

export const getMatchResultCommentsByUserId = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db.query('matchResultComments').withIndex(
      'by_user_id',
      ((q) => q.eq('userId', args.userId)),
    ).order('desc').collect();
    return await Promise.all(comments.map((comment) => joinUsersToComment(ctx, comment)));
  },
});
