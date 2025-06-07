import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { checkTournamentAuth } from '../_helpers/checkTournamentAuth';

export const endTournamentArgs = v.object({
  id: v.id('tournaments'),
});

export const endTournament = async (
  ctx: MutationCtx,
  { id }: Infer<typeof endTournamentArgs>,
) => {
  const tournament = await ctx.db.get(id);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }

  // --- CHECK AUTH ----
  checkTournamentAuth(ctx, tournament);

  // ---- CHECK ELIGIBILITY ----
  if (tournament.status === 'draft') {
    throw new ConvexError(getErrorMessage('CANNOT_END_DRAFT_TOURNAMENT'));
  }
  if (tournament.status === 'published') {
    throw new ConvexError(getErrorMessage('CANNOT_END_PUBLISHED_TOURNAMENT'));
  }
  if (tournament.status === 'active') {
    // OK
  }
  if (tournament.status === 'archived') {
    throw new ConvexError(getErrorMessage('TOURNAMENT_ALREADY_ARCHIVED'));
  }

  // ---- PRIMARY ACTIONS ----
  // End the tournament
  await ctx.db.patch(id, {
    status: 'archived',
  });
};
