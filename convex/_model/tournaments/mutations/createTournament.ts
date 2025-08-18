import { Infer, v } from 'convex/values';

import { Id } from '../../../_generated/dataModel';
import { MutationCtx } from '../../../_generated/server';
import { editableFields } from '../fields';

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
  // Don't use the create handler, but do it from scratch to avoid the fact that only TO's can create more TO's:
  await ctx.db.insert('tournamentOrganizers', {
    tournamentId,
    userId: ownerUserId,
    isOwner: true,
  });
  return tournamentId;
};
