import { getAuthUserId } from '@convex-dev/auth/server';
import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { advanceTournamentRound } from '../../tournaments/mutations';
import { generateTableAssignments } from '../actions/generateTableAssignments';
import { editableFields } from '../fields';

const { tournamentId } = editableFields;

export const unassignedPairingInput = v.object({
  playedTables: v.array(v.union(v.number(), v.null())),
  tournamentCompetitor0Id: v.id('tournamentCompetitors'),
  tournamentCompetitor1Id: v.union(v.id('tournamentCompetitors'), v.null()),
});

export type UnassignedPairingInput = Infer<typeof unassignedPairingInput>;

export const commitTournamentPairingsArgs = v.object({
  tournamentId,
  unassignedPairings: v.array(unassignedPairingInput),
});

// TODO: Throw error if pairings are invalid
// TODO: Throw error if there are too many pairings or some competitors are not active, etc.
// TODO: Throw error if pairings for that round already exist

/**
 * NOTE: The "commit" nomenclature is used since pairings exist in many forms (draft, unassigned, etc.).
 * This function actually "commits" the pairings for a given round to the database.
 * 
 * @param ctx 
 * @param args 
 * @returns 
 */
export const commitTournamentPairings = async (
  ctx: MutationCtx,
  args: Infer<typeof commitTournamentPairingsArgs>,
) => {
  const tournament = await ctx.db.get(args.tournamentId);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError(getErrorMessage('USER_NOT_AUTHENTICATED'));
  }
  if (!tournament.organizerUserIds.includes(userId)) {
    throw new ConvexError(getErrorMessage('USER_NOT_TOURNAMENT_ORGANIZER'));
  }
  if (tournament.status === 'draft') {
    throw new ConvexError(getErrorMessage('CANNOT_ADD_PAIRINGS_TO_DRAFT_TOURNAMENT'));
  }
  if (tournament.status === 'published') {
    throw new ConvexError(getErrorMessage('CANNOT_ADD_PAIRINGS_TO_PUBLISHED_TOURNAMENT'));
  }
  if (tournament.status === 'archived') {
    throw new ConvexError(getErrorMessage('CANNOT_ADD_PAIRINGS_TO_ARCHIVED_TOURNAMENT'));
  }
  if (tournament.currentRound !== undefined) {
    // TODO: Throw error "Cannot commit pairings for ongoing round"
  }
  const tableCount = Math.ceil(tournament.maxCompetitors / 2);
  
  const assignedPairings = generateTableAssignments(args.unassignedPairings, tableCount);
  
  const round = await advanceTournamentRound(ctx, {
    id: args.tournamentId,
  });

  return Promise.all(assignedPairings.map(async (pairing) => (
    await ctx.db.insert('tournamentPairings', {
      ...pairing,
      round,
      tournamentId: args.tournamentId,
    })
  )));
};
