import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { getAvailableActions, TournamentRegistrationActionKey } from '../_helpers/getAvailableActions';

export const toggleTournamentRegistrationActiveArgs = v.object({
  id: v.id('tournamentRegistrations'),
});

export const toggleTournamentRegistrationActive = async (
  ctx: MutationCtx,
  args: Infer<typeof toggleTournamentRegistrationActiveArgs>,
): Promise<boolean> => {
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
  const availableActions = await getAvailableActions(ctx, tournamentRegistration);
  if (!availableActions.includes(TournamentRegistrationActionKey.ToggleActive)) {
    throw new ConvexError(getErrorMessage('USER_DOES_NOT_HAVE_PERMISSION'));
  }

  // ---- PRIMARY ACTIONS ----
  const active = !tournamentRegistration.active;
  await ctx.db.patch(args.id, { active });
  return active;
};
