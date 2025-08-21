import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { getTournamentOrganizersByTournament } from '../../tournamentOrganizers';

export const toggleTournamentRegistrationActiveArgs = v.object({
  id: v.id('tournamentRegistrations'),
});

export const toggleTournamentRegistrationActive = async (
  ctx: MutationCtx,
  args: Infer<typeof toggleTournamentRegistrationActiveArgs>,
): Promise<void> => {
  // --- CHECK AUTH ----
  const userId = await checkAuth(ctx);

  // ---- VALIDATE ----
  const tournamentRegistration = await ctx.db.get(args.id);
  if (!tournamentRegistration) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_REGISTRATION_NOT_FOUND'));
  }
  const tournament = await ctx.db.get(tournamentRegistration.tournamentId);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_CONTAINING_REGISTRATION_NOT_FOUND'));
  }
  if (tournament.status === 'archived') {
    throw new ConvexError(getErrorMessage('CANNOT_MODIFY_ARCHIVED_TOURNAMENT'));
  }
  const activeTournamentRegistrations = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_tournament_competitor', (q) => q.eq('tournamentCompetitorId', tournamentRegistration.tournamentCompetitorId))
    .filter((q) => q.eq(q.field('active'), true))
    .collect();
  if (activeTournamentRegistrations.length >= tournament.competitorSize && !tournamentRegistration.active) {
    throw new ConvexError(getErrorMessage('COMPETITOR_ALREADY_HAS_MAX_PLAYERS'));
  }

  // ---- EXTENDED AUTH CHECK ----
  /* These user IDs can make changes to this tournament competitor:
   * - Tournament organizers;
   */
  const tournamentOrganizers = await getTournamentOrganizersByTournament(ctx, {
    tournamentId: tournamentRegistration.tournamentId,
  });
  const authorizedUserIds = tournamentOrganizers.map((r) => r.userId);
  if (!authorizedUserIds.includes(userId)) {
    throw new ConvexError(getErrorMessage('USER_DOES_NOT_HAVE_PERMISSION'));
  }

  // ---- PRIMARY ACTIONS ----
  await ctx.db.patch(args.id, {
    active: !tournamentRegistration.active,
  });
};
