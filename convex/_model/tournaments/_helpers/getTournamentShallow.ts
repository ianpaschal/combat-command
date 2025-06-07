import { ConvexError } from 'convex/values';

import { Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';

/**
 * Gets a tournament from the database without joining any additional data (shallow).
 * 
 * @remarks
 * This method should be used when you KNOW a tournament exists. This is almost always the case.
 * If the document does not exist in the database, this function will throw an error.
 * 
 * @param ctx - The Convex Query context
 * @param id - The ID of the tournament
 * @param strict - Optional flag to throw an error if the tournament is not found
 * @returns A raw tournament document
 */
export const getTournamentShallow = async (
  ctx: QueryCtx,
  id: Id<'tournaments'>,
) => {
  const tournament = await ctx.db.get(id);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }
  return tournament;
};

/**
 * A shallow tournament record from the database without additional data joined.
 */
export type TournamentShallow = Awaited<ReturnType<typeof getTournamentShallow>>;
