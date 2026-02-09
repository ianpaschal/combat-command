import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { getAvailableActions, TournamentRegistrationActionKey } from '../_helpers/getAvailableActions';
import { detailFields } from '../table';

export const updateTournamentRegistrationArgs = v.object({
  _id: v.id('tournamentRegistrations'),
  details: v.optional(detailFields),
});

export const updateTournamentRegistration = async (
  ctx: MutationCtx,
  args: Infer<typeof updateTournamentRegistrationArgs>,
): Promise<void> => {
  const { _id, ...updated } = args;
    
  // ---- AUTH & VALIDATION CHECK ----
  const doc = await ctx.db.get(_id);
  if (!doc) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_REGISTRATION_NOT_FOUND'));
  }
  const availableActions = await getAvailableActions(ctx, doc);
  if (!availableActions.includes(TournamentRegistrationActionKey.Edit)) {
    throw new ConvexError(getErrorMessage('USER_DOES_NOT_HAVE_PERMISSION'));
  }

  // ---- PRIMARY ACTIONS ----
  await ctx.db.patch(_id, {
    ...updated,
    modifiedAt: Date.now(),
  });
};
