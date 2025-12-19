import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { Id } from '../../../_generated/dataModel';
import { MutationCtx } from '../../../_generated/server';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { getErrorMessage } from '../../common/errors';
import { editableFields } from '../table';

export const createLeagueArgs = v.object({
  ...editableFields,
  organizerUserId: v.id('users'),
});

export const createLeague = async (
  ctx: MutationCtx,
  args: Infer<typeof createLeagueArgs>,
): Promise<Id<'leagues'>> => {

  const { organizerUserId, ...restArgs } = args;

  // --- CHECK AUTH ----
  const userId = await checkAuth(ctx);

  // ---- VALIDATE ----
  const leagues = await ctx.db.query('leagues').collect();
  for (const league of leagues) {
    if (league.title === args.title && league.editionYear === args.editionYear) {
      throw new ConvexError(getErrorMessage('LEAGUE_ALREADY_EXISTS'));
    }
  }

  // ---- EXTENDED AUTH CHECK ----
  /* These user IDs can make changes to this league :
   * - League creator;
   */
  const authorizedUserIds = [
    args.organizerUserId,
  ];
  if (!authorizedUserIds.includes(userId)) {
    throw new ConvexError(getErrorMessage('USER_DOES_NOT_HAVE_PERMISSION'));
  }

  // ---- PRIMARY ACTIONS ----
  const leagueId = await ctx.db.insert('leagues', {
    ...restArgs,
    status: 'draft',
  });
  await ctx.db.insert('leagueOrganizers', {
    userId: organizerUserId,
    leagueId,
  });
  return leagueId;
};
