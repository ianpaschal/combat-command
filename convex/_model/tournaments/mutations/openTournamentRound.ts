import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { generateTableAssignments, unassignedTournamentPairingFields } from '../../tournamentPairings';
import { createTournamentTimer } from '../../tournamentTimers';
import { checkTournamentAuth } from '../_helpers/checkTournamentAuth';
import { getTournamentShallow } from '../_helpers/getTournamentShallow';

export const openTournamentRoundArgs = v.object({
  id: v.id('tournaments'),
  unassignedPairings: v.array(unassignedTournamentPairingFields),
});

/**
 * Finalizes draft TournamentPairings and opens a new Tournament round.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.id - ID of the Tournament
 * @param args.unassignedPairings - Draft TournamentPairings to assign to tables
 */
export const openTournamentRound = async (
  ctx: MutationCtx,
  args: Infer<typeof openTournamentRoundArgs>,
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

  // TODO: Throw error if missing pairings
  // TODO: Throw error if pairings are invalid
  // TODO: Throw error if there are too many pairings or some competitors are not active, etc.
  // TODO: Throw error if pairings for that round already exist
  // TODO: Throw error if competitors have the wrong number of (active) players

  // ---- PRIMARY ACTIONS ----
  const tableCount = Math.ceil(tournament.maxCompetitors / 2);
  const nextRound = (tournament.lastRound ?? -1) + 1;

  // Assign pairings to tables:
  const assignedPairings = generateTableAssignments(args.unassignedPairings, tableCount);

  // Create pairing records:
  Promise.all(assignedPairings.map(async (pairing) => (
    // TODO: Make a mutation?
    await ctx.db.insert('tournamentPairings', {
      ...pairing,
      round: nextRound,
      tournamentId: args.id,
    })
  )));

  // Create a timer for the upcoming round:
  await createTournamentTimer(ctx, {
    tournamentId: tournament._id,
    round: nextRound,
  });

  // Open the round:
  await ctx.db.patch(args.id, {
    currentRound: nextRound,
  });
};
