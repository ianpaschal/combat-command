import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { checkTournamentAuth } from '../_helpers/checkTournamentAuth';

export const startTournamentArgs = v.object({
  id: v.id('tournaments'),
});

export const startTournament = async (
  ctx: MutationCtx,
  { id }: Infer<typeof startTournamentArgs>,
) => {
  const tournament = await ctx.db.get(id);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }

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
  await ctx.db.patch(id, {
    status: 'active',
  });
};
