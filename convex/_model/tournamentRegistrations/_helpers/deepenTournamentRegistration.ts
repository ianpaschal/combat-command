import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { checkUserIsTournamentOrganizer } from '../../tournamentOrganizers';
import { getUser } from '../../users';
import { getAvailableActions } from './getAvailableActions';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const deepenTournamentRegistration = async (
  ctx: QueryCtx,
  doc: Doc<'tournamentRegistrations'>,
) => {
  const userId = await getAuthUserId(ctx);
  const { details, ...restDoc } = doc;

  const user = await getUser(ctx, { id: doc.userId });
  if (!user) {
    throw new ConvexError(getErrorMessage('USER_NOT_FOUND'));
  }
  const tournament = await ctx.db.get(doc.tournamentId);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }

  const availableActions = await getAvailableActions(ctx, doc);

  const isOrganizer = await checkUserIsTournamentOrganizer(ctx, tournament._id, userId);
  const alignmentsVisible = isOrganizer || tournament.alignmentsRevealed;
  const factionsVisible = isOrganizer || tournament.factionsRevealed;

  // TODO: Use lists if they are present. getDetails()
  const alignments = Array.from(new Set(alignmentsVisible && details?.alignment ? [details.alignment] : []));
  const factions = Array.from(new Set(factionsVisible && details?.faction ? [details.faction] : []));

  return {
    ...restDoc,
    availableActions,
    user,
    displayName: user.displayName,
    alignments,
    factions,
  };
};

/**
 * Deep tournament registration with additional joined data and computed fields.
 */
export type DeepTournamentRegistration = Awaited<ReturnType<typeof deepenTournamentRegistration>>;
