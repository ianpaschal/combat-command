import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { calculateFowV4MatchResultScore } from '../../fowV4/calculateFowV4MatchResultScore';
import { getList } from '../../lists';
import { getUser } from '../../users/queries/getUser';
import { checkMatchResultDetailsVisibility } from './checkMatchResultDetailsVisibility';
import { deepenFowV4MatchResultDetails } from './deepenFowV4MatchResultDetails';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Deepens a match result by adding computed fields.
 * 
 * @remarks
 * This method's return type is, by nature, the definition of a deep match result.
 * 
 * @param ctx - Convex query context
 * @param doc - Raw match result document
 * @returns A deep match result
 */
export const deepenMatchResult = async (
  ctx: QueryCtx,
  doc: Doc<'matchResults'>,
) => {
  const player0User = doc?.player0UserId ? await getUser(ctx, {
    id: doc.player0UserId,
  }) : null;
  const player0DisplayName = player0User?.displayName ?? doc.player0Placeholder;
  const player0List = doc?.player0ListId ? await getList(ctx, {
    id: doc.player0ListId,
  }) : null;
  const player1User = doc?.player1UserId ? await getUser(ctx, {
    id: doc.player1UserId,
  }) : null;
  const player1DisplayName = player1User?.displayName ?? doc.player1Placeholder;
  const player1List = doc?.player1ListId ? await getList(ctx, {
    id: doc.player1ListId,
  }) : null;

  // TODO: This is FowV4 specific, needs to be made generic!
  const [player0Score, player1Score] = calculateFowV4MatchResultScore(doc.details);
  
  const showDetails = await checkMatchResultDetailsVisibility(ctx, doc);
  
  // Social
  const comments = await ctx.db.query('matchResultComments')
    .withIndex('by_match_result_id',((q) => q.eq('matchResultId', doc._id)))
    .collect();
  const likes = await ctx.db.query('matchResultLikes')
    .withIndex('by_match_result_id',((q) => q.eq('matchResultId', doc._id)))
    .collect();

  return {
    ...doc,
    player0DisplayName,
    player0Score,
    ...(player0User ? { player0User } : {}),
    ...(player0List ? { player0List } : {}),
    player1DisplayName,
    player1Score,
    ...(player1User ? { player1User } : {}),
    ...(player1List ? { player1List } : {}),
    details: showDetails ? deepenFowV4MatchResultDetails(doc.details) : undefined,
    likedByUserIds: likes.map((like) => like.userId),
    commentCount: comments.length,
  };
};

/**
 * Match result with additional computed fields.
 */
export type DeepMatchResult = Awaited<ReturnType<typeof deepenMatchResult>>;
