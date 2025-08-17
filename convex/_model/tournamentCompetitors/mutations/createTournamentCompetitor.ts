import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { Id } from '../../../_generated/dataModel';
import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { getTournamentOrganizersByTournament } from '../../tournamentOrganizers';
import { createTournamentRegistration } from '../../tournamentRegistrations/mutations/create';
import { editableFields } from '../fields';

export const createTournamentCompetitorArgs = v.object({
  ...editableFields,
  captainUserId: v.id('users'),
});

export const createTournamentCompetitor = async (
  ctx: MutationCtx,
  args: Infer<typeof createTournamentCompetitorArgs>,
): Promise<Id<'tournamentCompetitors'>> => {
  // --- CHECK AUTH ----
  const userId = await checkAuth(ctx);

  // ---- VALIDATE ----
  const tournament = await ctx.db.get(args.tournamentId);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }
  if (tournament.status === 'archived') {
    throw new ConvexError(getErrorMessage('CANNOT_MODIFY_ARCHIVED_TOURNAMENT'));
  }
  const tournamentCompetitors = await ctx.db.query('tournamentCompetitors')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', args.tournamentId))
    .collect();
  const existingTeamNames = tournamentCompetitors.map((item) => item.teamName);
  if (args.teamName && existingTeamNames.includes(args.teamName)) {
    throw new ConvexError(getErrorMessage('TEAM_ALREADY_IN_TOURNAMENT'));
  }
 
  const existingTournamentRegistration = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_tournament_user', (q) => q.eq('tournamentId', tournament._id).eq('userId', args.captainUserId))
    .first();
  if (existingTournamentRegistration) {
    throw new ConvexError({ userId: args.captainUserId, existingTournamentRegistration });
  }
  if (!args.captainUserId) {
    throw new ConvexError(getErrorMessage('CANNOT_CREATE_COMPETITOR_WITH_0_PLAYERS'));
  }

  // ---- EXTENDED AUTH CHECK ----
  /* These user IDs can make changes to this tournament competitor:
   * - Tournament organizers;
   */
  const tournamentOrganizers = await getTournamentOrganizersByTournament(ctx, {
    tournamentId: args.tournamentId,
  });
  const authorizedUserIds = [
    ...tournamentOrganizers.map((r) => r.userId),
    ...args.captainUserId,
  ];
  if (!authorizedUserIds.includes(userId)) {
    throw new ConvexError(getErrorMessage('USER_DOES_NOT_HAVE_PERMISSION'));
  }

  // ---- PRIMARY ACTIONS ----
  const { ...restArgs } = args;
  const tournamentCompetitorId = await ctx.db.insert('tournamentCompetitors', {
    ...restArgs,
    active: false,
  });

  await createTournamentRegistration(ctx, {
    userId: args.captainUserId,
    tournamentId: args.tournamentId,
    tournamentCompetitorId,
  });

  return tournamentCompetitorId;
};
