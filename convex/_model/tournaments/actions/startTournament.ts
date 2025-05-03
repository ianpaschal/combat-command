import { getAuthUserId } from '@convex-dev/auth/server';
import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';

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
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError(getErrorMessage('USER_NOT_AUTHENTICATED'));
  }
  if (!tournament.organizerUserIds.includes(userId)) {
    throw new ConvexError(getErrorMessage('USER_NOT_TOURNAMENT_ORGANIZER'));
  }
  if (tournament.status === 'draft') {
    throw new ConvexError(getErrorMessage('CANNOT_START_DRAFT_TOURNAMENT'));
  }
  if (tournament.status === 'active') {
    throw new ConvexError(getErrorMessage('CANNOT_START_ACTIVE_TOURNAMENT'));
  }
  if (tournament.status === 'archived') {
    throw new ConvexError(getErrorMessage('CANNOT_START_ARCHIVED_TOURNAMENT'));
  }
  await ctx.db.patch(id, {
    currentRound: 0,
    status: 'active',
  });
};
