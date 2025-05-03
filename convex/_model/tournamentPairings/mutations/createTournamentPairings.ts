import { getAuthUserId } from '@convex-dev/auth/server';
import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { editableFields } from '../fields';

const { tournamentId, round, ...pairingFields } = editableFields;

export const createTournamentPairingsArgs = v.object({
  tournamentId,
  round,
  pairings: v.array(v.object(pairingFields)),
});

export const createTournamentPairings = async (
  ctx: MutationCtx,
  {
    round,
    pairings,
    tournamentId,
  }: Infer<typeof createTournamentPairingsArgs>,
) => {
  const tournament = await ctx.db.get(tournamentId);
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
  // TODO: Re-enable this at some point... but ETC needs it for now.
  // if (tournament.status === 'published') {
  //   throw new ConvexError(getErrorMessage('CANNOT_ADD_PAIRINGS_TO_PUBLISHED_TOURNAMENT'));
  // }
  if (tournament.status === 'archived') {
    throw new ConvexError(getErrorMessage('CANNOT_ADD_PAIRINGS_TO_ARCHIVED_TOURNAMENT'));
  }

  // TODO: Throw error if pairings are invalid

  // Throw error if there are too many pairings or some competitors are not active, etc.

  // Throw error if pairings for that round already exist
  
  return Promise.all(pairings.map(async (pairing) => (
    await ctx.db.insert('tournamentPairings', {
      ...pairing,
      round,
      tournamentId,
    })
  )));
};
