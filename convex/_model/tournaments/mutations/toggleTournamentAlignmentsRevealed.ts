import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { getErrorMessage } from '../../common/errors';
import { checkUserIsTournamentOrganizer } from '../../tournamentOrganizers';

export const toggleTournamentAlignmentsRevealedArgs = v.object({
  id: v.id('tournaments'),
});

export const toggleTournamentAlignmentsRevealed = async (
  ctx: MutationCtx,
  args: Infer<typeof toggleTournamentAlignmentsRevealedArgs>,
): Promise<boolean> => {
  // --- CHECK AUTH ----
  const userId = await checkAuth(ctx);

  // ---- VALIDATE ----
  const tournament = await ctx.db.get(args.id);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }

  // ---- EXTENDED AUTH CHECK ----
  /* These user IDs can make changes to this tournament competitor:
   * - Tournament organizers;
   */
  const isOrganizer = await checkUserIsTournamentOrganizer(ctx, args.id, userId);
  if (!isOrganizer) {
    throw new ConvexError(getErrorMessage('USER_DOES_NOT_HAVE_PERMISSION'));
  }

  // ---- PRIMARY ACTIONS ----
  const alignmentsRevealed = !tournament.alignmentsRevealed;
  await ctx.db.patch(args.id, {
    alignmentsRevealed,
    ...(alignmentsRevealed === false && {
      factionsRevealed: false,
    }),
  });
  return alignmentsRevealed;
};
