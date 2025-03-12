import { v } from 'convex/values';

import { query } from '../_generated/server';
import { getLimitedUser } from '../users/utils/getLimitedUser';

export const fetchMatchResult = query({
  args: {
    id: v.id('matchResults'),
  },
  handler: async (ctx, args) => {
    const matchResult = await ctx.db.get(args.id);
    if (!matchResult) {
      return null;
    }
    const mission = await ctx.db.get(matchResult.details.missionId);
    const comments = await ctx.db.query('matchResultComments').withIndex(
      'by_match_result_id',
      ((q) => q.eq('matchResultId', args.id)),
    ).collect();
    const likes = await ctx.db.query('matchResultLikes').withIndex(
      'by_match_result_id',
      ((q) => q.eq('matchResultId', args.id)),
    ).collect();
    return {
      ...matchResult,
      player0User: await getLimitedUser(ctx, matchResult?.player0UserId),
      player1User: await getLimitedUser(ctx, matchResult?.player1UserId),
      details: {
        ...matchResult.details,
        missionName: mission?.displayName,
      },
      likedByUserIds: likes.map((like) => like.userId),
      commentCount: comments.length,
    };
  },
});
