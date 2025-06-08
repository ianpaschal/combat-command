import { Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { deepenTournament, TournamentDeep } from './deepenTournament';
import { getTournamentShallow } from './getTournamentShallow';

/**
 * Gets a tournament from the database with additional relevant data joined (deep).
 * 
 * @remarks
 * This method should be used when you KNOW a Tournament exists.
 * This is almost always the case.
 * If the document does not exist in the database, this function will throw an error.
 * 
 * @param ctx - Convex query context
 * @param id - ID of the Tournament
 * @returns A deep Tournament
 */
export const getTournamentDeep = async (
  ctx: QueryCtx,
  id: Id<'tournaments'>,
): Promise<TournamentDeep> => {
  const tournament = await getTournamentShallow(ctx, id);  
  return await deepenTournament(ctx, tournament);
};
