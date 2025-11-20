import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { checkTournamentAuth, getTournamentShallow } from '../../tournaments';
import { getTournamentPairings } from '../queries/getTournamentPairings';
import { sharedFields } from '../table';

export const deleteTournamentPairingsArgs = v.object({
  ...sharedFields,
});

export const deleteTournamentPairings = async (
  ctx: MutationCtx,
  args: Infer<typeof deleteTournamentPairingsArgs>,
): Promise<void> => {
  const tournament = await getTournamentShallow(ctx, args.tournamentId);
  const tournamentPairings = await getTournamentPairings(ctx, args);

  // --- CHECK AUTH ----
  checkTournamentAuth(ctx, tournament);

  // ---- VALIDATE ----
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
    throw new ConvexError(getErrorMessage('CANNOT_ADD_PAIRINGS_TO_IN_PROGRESS_ROUND'));
  }

  // ---- PRIMARY ACTIONS ----
  for (const pairing of tournamentPairings) {
    await ctx.db.delete(pairing._id);
  }
};
