import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getList } from '../../lists/queries/getList';
import { getUser } from '../../users';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const deepenTournamentRegistration = async (
  ctx: QueryCtx,
  tournamentRegistration: Doc<'tournamentRegistrations'>,
) => {
  const user = await getUser(ctx, { id: tournamentRegistration.userId });
  const list = tournamentRegistration.listId ? (
    await getList(ctx, { id: tournamentRegistration.listId })
  ) : undefined;

  return {
    ...tournamentRegistration,
    user,
    list,
  };
};

/**
 * Deep tournament registration with additional joined data and computed fields.
 */
export type DeepTournamentRegistration = Awaited<ReturnType<typeof deepenTournamentRegistration>>;
