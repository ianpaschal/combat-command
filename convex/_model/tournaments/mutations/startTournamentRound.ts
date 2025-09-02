import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { createTournamentTimer } from '../../tournamentTimers';
import { checkTournamentAuth } from '../_helpers/checkTournamentAuth';
import { getTournamentShallow } from '../_helpers/getTournamentShallow';

export const startTournamentRoundArgs = v.object({
  id: v.id('tournaments'),
});

/**
 * Starts a new tournament round.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.id - ID of the tournament
 */
export const startTournamentRound = async (
  ctx: MutationCtx,
  args: Infer<typeof startTournamentRoundArgs>,
): Promise<void> => {
  const tournament = await getTournamentShallow(ctx, args.id);

  // --- CHECK AUTH ----
  checkTournamentAuth(ctx, tournament);

  // ---- VALIDATE ----
  if (tournament.status === 'draft') {
    throw new ConvexError(getErrorMessage('CANNOT_OPEN_ROUND_ON_DRAFT_TOURNAMENT'));
  }
  if (tournament.status === 'published') {
    throw new ConvexError(getErrorMessage('CANNOT_OPEN_ROUND_ON_PUBLISHED_TOURNAMENT'));
  }
  if (tournament.status === 'archived') {
    throw new ConvexError(getErrorMessage('CANNOT_OPEN_ROUND_ON_ARCHIVED_TOURNAMENT'));
  }
  if (tournament.currentRound !== undefined) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_ALREADY_HAS_OPEN_ROUND'));
  }

  // ---- PRIMARY ACTIONS ----
  const nextRound = (tournament.lastRound ?? -1) + 1;

  // Create (and start) a timer for the upcoming round:
  await createTournamentTimer(ctx, {
    tournamentId: tournament._id,
    round: nextRound,
  });

  // Open the round:
  await ctx.db.patch(args.id, {
    currentRound: nextRound,
  });
};
