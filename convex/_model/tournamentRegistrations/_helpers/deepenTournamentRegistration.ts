import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getUser } from '../../users';
import { getAvailableActions } from './getAvailableActions';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const deepenTournamentRegistration = async (
  ctx: QueryCtx,
  doc: Doc<'tournamentRegistrations'>,
) => {
  const user = await getUser(ctx, { id: doc.userId });
  const availableActions = await getAvailableActions(ctx, doc);
  const lists = await ctx.db.query('lists')
    .withIndex('by_tournament_registration', (q) => q.eq('tournamentRegistrationId', doc._id))
    .collect();

  return {
    ...doc,
    availableActions,
    lists,
    user,
  };
};

/**
 * Deep tournament registration with additional joined data and computed fields.
 */
export type DeepTournamentRegistration = Awaited<ReturnType<typeof deepenTournamentRegistration>>;
