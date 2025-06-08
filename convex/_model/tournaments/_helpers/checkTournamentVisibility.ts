import { getAuthUserId } from '@convex-dev/auth/server';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';

/**
 * Checks if a User has permission to view a Tournament.
 * 
 * @param ctx - Convex query context
 * @param tournament - Raw Tournament document
 * @returns Boolean representing whether the query User can view the given Tournament
 */
export const checkTournamentVisibility = async (
  ctx: QueryCtx,
  tournament: Doc<'tournaments'>, // TODO: Make union with TournamentDeep
): Promise<boolean> => {
  const userId = await getAuthUserId(ctx);
  if (tournament.status === 'draft' && (!userId || !tournament.organizerUserIds.includes(userId))) {
    return false;
  }
  return true;
};
