import { getMissionDisplayName } from '@ianpaschal/combat-command-static-data/flamesOfWarV4';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { calculateFowV4MatchResultScore } from '../../fowV4/calculateFowV4MatchResultScore';
import { getUser } from '../../users/queries/getUser';
import { checkMatchResultBattlePlanVisibility } from './checkMatchResultBattlePlanVisibility';

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
  const player0User = matchResult?.player0UserId ? await getUser(ctx, {
    id: matchResult.player0UserId,
  }) : null;
  const player0List = matchResult?.player0ListId ? await ctx.db.get(matchResult.player0ListId) : null;
  const player1User = matchResult?.player1UserId ? await getUser(ctx, {
    id: matchResult.player1UserId,
  }) : null;
  const player1List = matchResult?.player1ListId ? await ctx.db.get(matchResult.player1ListId) : null;
  
  // Social
  const comments = await ctx.db.query('matchResultComments')
    .withIndex('by_match_result_id',((q) => q.eq('matchResultId', matchResult._id)))
    .collect();
  const likes = await ctx.db.query('matchResultLikes')
    .withIndex('by_match_result_id',((q) => q.eq('matchResultId', matchResult._id)))
    .collect();

  // Details
  const missionName = getMissionDisplayName(matchResult.details.mission);
  const battlePlansVisible = await checkMatchResultBattlePlanVisibility(ctx, matchResult);

  // TODO: This is FowV4 specific, needs to be made generic!
  const [player0Score, player1Score] = calculateFowV4MatchResultScore(matchResult);

  return {
    ...matchResult,
    ...(player0User ? { player0User } : {}),
    ...(player0List ? { player0List } : {}),
    ...(player1User ? { player1User } : {}),
    ...(player1List ? { player1List } : {}),
    details: {
      ...matchResult.details,
      player0BattlePlan: battlePlansVisible ? matchResult.details.player0BattlePlan : undefined,
      player1BattlePlan: battlePlansVisible ? matchResult.details.player1BattlePlan : undefined,
      missionName,
      player0Score,
      player1Score,
    },
    likedByUserIds: likes.map((like) => like.userId),
    commentCount: comments.length,
  };
};

/**
 * Match result with additional computed fields.
 */
export type DeepMatchResult = Awaited<ReturnType<typeof deepenMatchResult>>;
