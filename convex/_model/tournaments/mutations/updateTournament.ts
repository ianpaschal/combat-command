import { Infer, v } from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { checkTournamentAuth } from '../_helpers/checkTournamentAuth';
import { getTournamentShallow } from '../_helpers/getTournamentShallow';
import { editableFields } from '../table';

export const updateTournamentArgs = v.object({
  id: v.id('tournaments'),
  ...editableFields,
});

/**
 * Updates a Tournament.
 * 
 * @param ctx - Convex query context
 * @param args - Tournament data
 */
export const updateTournament = async (
  ctx: MutationCtx,
  args: Infer<typeof updateTournamentArgs>,
): Promise<void> => {
  const { id, ...updated } = args;
  const tournament = await getTournamentShallow(ctx, id);
  
  // --- CHECK AUTH ----
  checkTournamentAuth(ctx, tournament);

  // ---- CHECK PER-FIELD ELIGIBILITY ----
  if (tournament.status !== 'draft') {
    if (args.competitorSize !== tournament.competitorSize) {
      // TODO: Throw
    }
    if (args.maxCompetitors !== tournament.maxCompetitors) {
      // TODO: Throw
    }
    if (args.useNationalTeams !== tournament.useNationalTeams) {
      // TODO: Throw
    }
  }
  // TODO: Add checks for active tournament and ranking factors

  if (tournament.logoStorageId && args.logoStorageId === null) {
    await ctx.storage.delete(tournament.logoStorageId);
    // Don't throw an error here... even if the file doesn't delete the changes can be saved
  }
  if (tournament.bannerStorageId && args.bannerStorageId === null) {
    await ctx.storage.delete(tournament.bannerStorageId);
    // Don't throw an error here... even if the file doesn't delete the changes can be saved
  }
  
  // ---- PRIMARY ACTIONS ----
  await ctx.db.patch(id, {
    ...updated,
    modifiedAt: Date.now(),
  });
};
