import { getAuthUserId } from '@convex-dev/auth/server';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { checkUserIsLeagueOrganizer } from '../../leagueOrganizers';

/**
 * Checks if a User has permission to view a League.
 * 
 * @param ctx - Convex query context
 * @param league - Raw League document
 * @returns Boolean representing whether the query User can view the given League
 */
export const checkLeagueVisibility = async (
  ctx: QueryCtx,
  league: Doc<'leagues'>,
): Promise<boolean> => {
  const userId = await getAuthUserId(ctx);
  const isOrganizer = await checkUserIsLeagueOrganizer(ctx, league._id, userId);
  if (league.status === 'draft' && !isOrganizer) {
    return false;
  }
  return true;
};
