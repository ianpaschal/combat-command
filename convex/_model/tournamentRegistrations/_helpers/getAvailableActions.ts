import { getAuthUserId } from '@convex-dev/auth/server';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { checkUserIsTournamentOrganizer } from '../../tournamentOrganizers';

export enum TournamentRegistrationActionKey {
  // ---- TO Actions ----

  /** Delete this TournamentRegistration (and TournamentCompetitor if no remaining players). */
  Delete = 'delete',

  // TODO
  // ApproveList = 'approveList',
  
  // TODO
  // RejectList = 'rejectList',
  
  // TODO
  // Transfer = 'transfer',

  // ---- TO or Captain Actions ----
  ToggleActive = 'toggleActive',

  // ---- Player Actions ----

  /** Delete own TournamentRegistration (and TournamentCompetitor if no remaining players). */
  Leave = 'leave',

  // TODO
  // SubmitList = 'submitList',
}

/**
 * Gets a list of tournament registration actions which are available to a user.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.id - ID of the tournament registration
 * @returns An array of TournamentRegistrationActionKey(s)
 */
export const getAvailableActions = async (
  ctx: QueryCtx,
  doc: Doc<'tournamentRegistrations'>,
): Promise<TournamentRegistrationActionKey[]> => {
  const tournamentCompetitor = await ctx.db.get(doc.tournamentCompetitorId);
  if (!tournamentCompetitor) {
    return [];
  }
  const tournament = await ctx.db.get(doc.tournamentId);
  if (!tournament) {
    return [];
  }
  const tournamentRegistrations = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_tournament_competitor', (q) => q.eq('tournamentCompetitorId', tournamentCompetitor._id))
    .collect();

  // --- CHECK AUTH ----
  const userId = await getAuthUserId(ctx);

  const isOrganizer = await checkUserIsTournamentOrganizer(ctx, tournament._id, userId);
  const isSelf = userId && doc.userId === userId;
  const isTeamTournament = tournament.competitorSize > 1;
  const isCaptain = isTeamTournament && userId && tournamentCompetitor.captainUserId === userId;
  const hasSparePlayers = tournamentRegistrations.length > tournament.competitorSize;
  // const isListSubmissionOpen = Date.now() < tournament.listSubmissionClosesAt;

  // ---- PRIMARY ACTIONS ----
  const actions: TournamentRegistrationActionKey[] = [];

  if (tournament.status === 'archived') {
    return actions;
  }

  // if (isOrganizer) {
  //   actions.push(TournamentRegistrationActionKey.ApproveList);
  // }

  if ((isOrganizer || (isCaptain && !isSelf)) && tournament.status === 'published') {
    actions.push(TournamentRegistrationActionKey.Delete);
  }

  if (isSelf && tournament.status === 'published') {
    actions.push(TournamentRegistrationActionKey.Leave);
  }

  // if (isOrganizer) {
  //   actions.push(TournamentRegistrationActionKey.RejectList);
  // }

  // if (isOrganizer || ((isCaptain || isPlayer) && isListSubmissionOpen)) {
  //   actions.push(TournamentRegistrationActionKey.SubmitList);
  // }

  if ((isOrganizer || isCaptain) && hasSparePlayers) {
    actions.push(TournamentRegistrationActionKey.ToggleActive);
  }

  // if (isOrganizer) {
  //   actions.push(TournamentRegistrationActionKey.Transfer);
  // }

  return actions;
};
