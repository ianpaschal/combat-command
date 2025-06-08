import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { checkTournamentAuth } from '../_helpers/checkTournamentAuth';
import { getTournamentShallow } from '../_helpers/getTournamentShallow';

export const startTournamentArgs = v.object({
  id: v.id('tournaments'),
});

/**
 * Starts a Tournament (changes its status to 'active').
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.id - ID of the Tournament
 */
export const startTournament = async (
  ctx: MutationCtx,
  args: Infer<typeof startTournamentArgs>,
): Promise<void> => {
  const tournament = await getTournamentShallow(ctx, args.id);

  // --- CHECK AUTH ----
  checkTournamentAuth(ctx, tournament);

  // ---- CHECK ELIGIBILITY ----
  if (tournament.status === 'draft') {
    throw new ConvexError(getErrorMessage('CANNOT_START_DRAFT_TOURNAMENT'));
  }
  if (tournament.status === 'published') {
    // OK
  }
  if (tournament.status === 'active') {
    throw new ConvexError(getErrorMessage('TOURNAMENT_ALREADY_ACTIVE'));
  }
  if (tournament.status === 'archived') {
    throw new ConvexError(getErrorMessage('CANNOT_START_ARCHIVED_TOURNAMENT'));
  }

  // ---- PRIMARY ACTIONS ----
  // Start the tournament
  await ctx.db.patch(args.id, {
    status: 'active',
  });
};
