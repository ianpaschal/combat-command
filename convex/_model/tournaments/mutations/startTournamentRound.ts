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

  const nextRound = (tournament.lastRound ?? -1) + 1;

  const tournamentPairings = await ctx.db.query('tournamentPairings')
    .withIndex('by_tournament_round', (q) => q.eq('tournamentId', tournament._id).eq('round',nextRound))
    .collect();
  const tournamentCompetitors = await ctx.db.query('tournamentCompetitors')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', tournament._id))
    .collect();

  for (const pairing of tournamentPairings) {
    const competitorIds = [
      pairing.tournamentCompetitor0Id,
      pairing.tournamentCompetitor1Id,
    ];
    for (const id of competitorIds) {
      const competitor = tournamentCompetitors.find((v) => v._id === id);
      if (id && !competitor?.active) {
        throw new ConvexError(getErrorMessage('CANNOT_OPEN_ROUND_WITH_INACTIVE_COMPETITORS'));
      }
    }
  }

  // ---- PRIMARY ACTIONS ----
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
