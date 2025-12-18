import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { Id } from '../../../_generated/dataModel';
import { MutationCtx } from '../../../_generated/server';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { getErrorMessage } from '../../common/errors';
import { getLeagueOrganizersByLeague } from '../queries/getLeagueOrganizersByLeague';
import { editableFields } from '../table';

export const createLeagueOrganizerArgs = v.object({
  ...editableFields,
});

export const createLeagueOrganizer = async (
  ctx: MutationCtx,
  args: Infer<typeof createLeagueOrganizerArgs>,
): Promise<Id<'leagueOrganizers'>> => {

  // --- CHECK AUTH ----
  const userId = await checkAuth(ctx);

  // ---- VALIDATE ----
  const league = await ctx.db.get(args.leagueId);
  if (!league) {
    throw new ConvexError(getErrorMessage('LEAGUE_NOT_FOUND'));
  }
  const leagueOrganizers = await getLeagueOrganizersByLeague(ctx, {
    leagueId: league._id,
  });
  if (leagueOrganizers.find((to) => to.userId === args.userId)) {
    throw new ConvexError(getErrorMessage('USER_ALREADY_ORGANIZER'));
  }

  // ---- EXTENDED AUTH CHECK ----
  /* These user IDs can make changes to this league organizer:
   * - League organizers;
   */
  const authorizedUserIds = [
    ...leagueOrganizers.map((lo) => lo.userId),
    ...(leagueOrganizers.length === 0 ? [args.userId] : []),
  ];
  if (!authorizedUserIds.includes(userId)) {
    throw new ConvexError(getErrorMessage('USER_DOES_NOT_HAVE_PERMISSION'));
  }

  // ---- PRIMARY ACTIONS ----
  return await ctx.db.insert('leagueOrganizers', {
    ...args,
  });
};
