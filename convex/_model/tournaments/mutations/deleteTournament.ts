import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { checkTournamentAuth } from '../_helpers/checkTournamentAuth';
import { getTournamentShallow } from '../_helpers/getTournamentShallow';

export const deleteTournamentArgs = v.object({
  id: v.id('tournaments'),
});

/**
 * Deletes a Tournament.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.id - ID of the Tournament
 */
export const deleteTournament = async (
  ctx: MutationCtx,
  args: Infer<typeof deleteTournamentArgs>,
): Promise<void> => {
  const tournament = await getTournamentShallow(ctx, args.id);
  
  // --- CHECK AUTH ----
  checkTournamentAuth(ctx, tournament);

  // ---- CHECK ELIGIBILITY ----
  if (tournament.status === 'active') {
    throw new ConvexError(getErrorMessage('CANNOT_DELETE_ACTIVE_TOURNAMENT'));
  }
  if (tournament.status === 'archived') {
    throw new ConvexError(getErrorMessage('CANNOT_DELETE_ARCHIVED_TOURNAMENT'));
  }

  // ---- PRIMARY ACTIONS ----
  // Delete the Tournament:
  await ctx.db.delete(args.id);

  // Cascade to Tournament Competitors:
  const tournamentCompetitors = await ctx.db.query('tournamentCompetitors')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', args.id))
    .collect();
  for (const record of tournamentCompetitors) {
    await ctx.db.delete(record._id);
  }

  // Cascade to Tournament Pairings:
  const tournamentPairings = await ctx.db.query('tournamentPairings')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', args.id))
    .collect();
  for (const record of tournamentPairings) {
    await ctx.db.delete(record._id);
  }

  // Cascade to Tournament Registrations
  const tournamentRegistrations = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_tournament', (q) => q.eq('tournamentId', args.id))
    .collect();
  for (const record of tournamentRegistrations) {
    await ctx.db.delete(record._id);
  }

  // Cascade to Tournament Organizers
  const tournamentOrganizers = await ctx.db.query('tournamentOrganizers')
    .withIndex('by_tournament', (q) => q.eq('tournamentId', args.id))
    .collect();
  for (const record of tournamentOrganizers) {
    await ctx.db.delete(record._id);
  }
};
