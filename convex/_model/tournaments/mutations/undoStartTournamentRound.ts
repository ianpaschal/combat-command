import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { deleteTournamentTimerByTournament } from '../../tournamentTimers';
import { checkTournamentAuth } from '../_helpers/checkTournamentAuth';
import { getTournamentShallow } from '../_helpers/getTournamentShallow';

export const undoStartTournamentRoundArgs = v.object({
  id: v.id('tournaments'),
});

/**
 * Ends a currently open tournament round, rolling back rather than advancing.
 * 
 * @param ctx - Convex mutation context
 * @param args - Convex mutation args
 * @param args.id - ID of the tournament
 */
export const undoStartTournamentRound = async (
  ctx: MutationCtx,
  args: Infer<typeof undoStartTournamentRoundArgs>,
): Promise<void> => {
  const tournament = await getTournamentShallow(ctx, args.id);
  
  // --- CHECK AUTH ----
  checkTournamentAuth(ctx, tournament);

  // ---- CHECK ELIGIBILITY ----
  if (tournament.status === 'draft') {
    throw new ConvexError(getErrorMessage('CANNOT_CLOSE_ROUND_ON_DRAFT_TOURNAMENT'));
  }
  if (tournament.status === 'published') {
    throw new ConvexError(getErrorMessage('CANNOT_CLOSE_ROUND_ON_PUBLISHED_TOURNAMENT'));
  }
  if (tournament.status === 'archived') {
    throw new ConvexError(getErrorMessage('CANNOT_CLOSE_ROUND_ON_ARCHIVED_TOURNAMENT'));
  }
  if (tournament.currentRound === undefined) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_DOES_NOT_HAVE_OPEN_ROUND'));
  }

  // ---- PRIMARY ACTIONS ----
  // Clean up TournamentTimer:
  await deleteTournamentTimerByTournament(ctx, {
    tournamentId: tournament._id,
    round: tournament.currentRound,
  });

  // Close the round:
  await ctx.db.patch(args. id, {
    currentRound: undefined,
  });
};
