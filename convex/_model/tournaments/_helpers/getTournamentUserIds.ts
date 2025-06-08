import { Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getTournamentCompetitorsByTournamentId } from '../../tournamentCompetitors/helpers';
import { getTournamentShallow } from './getTournamentShallow';

/**
 * Gets all User IDs linked by a common Tournament.
 * 
 * @param ctx - Convex query context
 * @param id - ID of the Tournament
 * @returns An array of User IDs
 */
export const getTournamentUserIds = async (
  ctx: QueryCtx,
  id: Id<'tournaments'>,
): Promise<Id<'users'>[]> => {
  const { organizerUserIds } = await getTournamentShallow(ctx, id);
  const tournamentCompetitors = await getTournamentCompetitorsByTournamentId(ctx, id);
  const playerUserIds = tournamentCompetitors.reduce((acc: Id<'users'>[], c) => [
    ...acc,
    ...c.players.map((p) => p.userId),
  ], []);

  // Pass through Set() to remove duplicates
  return Array.from(new Set([
    ...organizerUserIds,
    ...playerUserIds,
  ]));
};
