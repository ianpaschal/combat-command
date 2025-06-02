import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { generateTableAssignments } from '../../tournamentPairings/actions/generateTableAssignments';
import { checkTournamentAuth } from '../_helpers/checkTournamentAuth';

// TODO: Move to pairings
export const unassignedPairing = v.object({
  playedTables: v.array(v.union(v.number(), v.null())),
  tournamentCompetitor0Id: v.id('tournamentCompetitors'),
  tournamentCompetitor1Id: v.union(v.id('tournamentCompetitors'), v.null()),
});

// TODO: Move to pairings
export type UnassignedPairingInput = Infer<typeof unassignedPairing>;

export const openTournamentRoundArgs = v.object({
  id: v.id('tournaments'),
  unassignedPairings: v.array(unassignedPairing),
});

export const openTournamentRound = async (
  ctx: MutationCtx,
  args: Infer<typeof openTournamentRoundArgs>,
) => {
  const tournament = await ctx.db.get(args.id);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }

  // --- CHECK AUTH ----
  checkTournamentAuth(ctx, tournament);

  // ---- CHECK ELIGIBILITY ----
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

  // ---- PRIMARY ACTIONS ----
  const tableCount = Math.ceil(tournament.maxCompetitors / 2);
  const nextRound = !tournament.lastRound ? 0 : tournament.lastRound++;
  
  // Assign pairings to tables
  const assignedPairings = generateTableAssignments(args.unassignedPairings, tableCount);

  // Create pairing records
  Promise.all(assignedPairings.map(async (pairing) => (
    await ctx.db.insert('tournamentPairings', {
      ...pairing,
      round: nextRound,
      tournamentId: args.id,
    })
  )));

  // TODO: Create TournamentRoundTimer
  // await ctx.db.insert('tournamentTimers', {
  //   pausedAt: null,
  //   pauseTime: 0,
  //   round: nextRound,
  //   startedAt: null,
  //   tournamentId: tournament._id,
  // });

  // Open the round
  await ctx.db.patch(args.id, {
    currentRound: nextRound,
  });
};
