import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getUser } from '../../users';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const deepenTournamentOrganizer = async (
  ctx: QueryCtx,
  doc: Doc<'tournamentOrganizers'>,
) => {
  const user = await getUser(ctx, { id: doc.userId });
  return {
    ...doc,
    user,
  };
};

/**
 * Deep tournament registration with additional joined data and computed fields.
 */
export type DeepTournamentOrganizer = Awaited<ReturnType<typeof deepenTournamentOrganizer>>;
