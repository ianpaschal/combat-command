import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getLimitedUser } from '../../../users/utils/getLimitedUser';
import { getMission } from '../../fowV4/getMission';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Deepens a match result by adding computed fields.
 * 
 * @remarks
 * This method's return type is, by nature, the definition of a deep match result.
 * 
 * @param ctx - Convex query context
 * @param matchResult - Raw match result document
 * @returns A deep match result
 */
export const deepenMatchResult = async (
  ctx: QueryCtx,
  matchResult: Doc<'matchResults'>,
) => {
  const player0User = await getLimitedUser(ctx, matchResult?.player0UserId);
  const player1User = await getLimitedUser(ctx, matchResult?.player1UserId);
  const mission = getMission(matchResult.details.missionId);
  const comments = await ctx.db.query('matchResultComments')
    .withIndex('by_match_result_id',((q) => q.eq('matchResultId', matchResult._id)))
    .collect();
  const likes = await ctx.db.query('matchResultLikes')
    .withIndex('by_match_result_id',((q) => q.eq('matchResultId', matchResult._id)))
    .collect();
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
};

/**
 * Match result with additional computed fields.
 */
export type DeepMatchResult = Awaited<ReturnType<typeof deepenMatchResult>>;
