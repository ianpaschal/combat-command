import { Infer, v } from 'convex/values';

import { Id } from '../../../_generated/dataModel';
import { MutationCtx } from '../../../_generated/server';
import { createTournamentOrganizer } from '../../tournamentOrganizers';
import { editableFields } from '../table';

export const createTournamentArgs = v.object({
  ...editableFields,
  ownerUserId: v.id('users'),
});

/**
 * Creates a new Tournament.
 * 
 * @param ctx - Convex query context
 * @param args - Tournament data
 * @returns ID of the newly created Tournament
 */
export const createTournament = async (
  ctx: MutationCtx,
  args: Infer<typeof createTournamentArgs>,
): Promise<Id<'tournaments'>> => {
  const { ownerUserId, ...restArgs } = args;
  const tournamentId = await ctx.db.insert('tournaments', {
    ...restArgs,
    status: 'draft',
  });
  await createTournamentOrganizer(ctx, {
    tournamentId,
    userId: ownerUserId,
  });
  return tournamentId;
};
