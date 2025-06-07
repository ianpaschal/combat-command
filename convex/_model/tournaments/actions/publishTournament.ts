import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { checkTournamentAuth } from '../_helpers/checkTournamentAuth';

export const publishTournamentArgs = v.object({
  id: v.id('tournaments'),
});

export const publishTournament = async (
  ctx: MutationCtx,
  { id }: Infer<typeof publishTournamentArgs>,
) => {
  const tournament = await ctx.db.get(id);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }

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
  await ctx.db.patch(id, {
    status: 'published',
  });
};
