import { ConvexError } from 'convex/values';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { getUser } from '../../users';
import { getAvailableActions } from './getAvailableActions';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const deepenTournamentRegistration = async (
  ctx: QueryCtx,
  doc: Doc<'tournamentRegistrations'>,
) => {
  const user = await getUser(ctx, { id: doc.userId });
  if (!user) {
    throw new ConvexError(getErrorMessage('USER_NOT_FOUND'));
  }
  const availableActions = await getAvailableActions(ctx, doc);

  return {
    ...doc,
    availableActions,
    user,
    displayName: user.displayName,
  };
};

/**
 * Deep tournament registration with additional joined data and computed fields.
 */
export type DeepTournamentRegistration = Awaited<ReturnType<typeof deepenTournamentRegistration>>;
