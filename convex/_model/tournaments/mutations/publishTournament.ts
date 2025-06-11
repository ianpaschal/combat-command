import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { checkTournamentAuth } from '../_helpers/checkTournamentAuth';
import { getTournamentShallow } from '../_helpers/getTournamentShallow';

export const publishTournamentArgs = v.object({
  id: v.id('tournaments'),
});

/**
 * Publishes a Tournament (changes its status to 'published').
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.id - ID of the Tournament
 */
export const publishTournament = async (
  ctx: MutationCtx,
  args: Infer<typeof publishTournamentArgs>,
): Promise<void> => {
  const tournament = await getTournamentShallow(ctx, args.id);

  // --- CHECK AUTH ----
  checkTournamentAuth(ctx, tournament);

  // ---- CHECK ELIGIBILITY ----
  if (tournament.status === 'draft') {
    // OK
  }
  if (tournament.status === 'published') {
    throw new ConvexError(getErrorMessage('TOURNAMENT_ALREADY_PUBLISHED'));
  }
  if (tournament.status === 'active') {
    throw new ConvexError(getErrorMessage('CANNOT_PUBLISH_ACTIVE_TOURNAMENT'));
  }
  if (tournament.status === 'archived') {
    throw new ConvexError(getErrorMessage('CANNOT_PUBLISH_ARCHIVED_TOURNAMENT'));
  }

  // ---- PRIMARY ACTIONS ----
  // Publish the tournament
  await ctx.db.patch(args.id, {
    status: 'published',
  });
};
