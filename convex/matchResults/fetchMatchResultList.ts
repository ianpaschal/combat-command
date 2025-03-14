import { query } from '../_generated/server';
import { getMission } from '../common/fowV4/getMission';
import { getLimitedUser } from '../users/utils/getLimitedUser';

export const fetchMatchResultList = query({
  args: {},
  handler: async (ctx) => {
    const matchResults = await ctx.db.query('matchResults').collect();
    return Promise.all(matchResults.map(async (matchResult) => {
      const player0User = await getLimitedUser(ctx, matchResult?.player0UserId);
      const player1User = await getLimitedUser(ctx, matchResult?.player1UserId);
      const mission = getMission(matchResult.details.missionId);
      const comments = await ctx.db.query('matchResultComments').withIndex(
        'by_match_result_id',
        ((q) => q.eq('matchResultId', matchResult._id)),
      ).collect();
      const likes = await ctx.db.query('matchResultLikes').withIndex(
        'by_match_result_id',
        ((q) => q.eq('matchResultId', matchResult._id)),
      ).collect();
      return {
        ...matchResult,
        ...(player0User ? { player0User } : {}),
        ...(player1User ? { player1User } : {}),
        details: {
          ...matchResult.details,
          missionName: mission?.displayName,
        },
        likedByUserIds: likes.map((like) => like.userId),
        commentCount: comments.length,
      };
    }));
  },
});
