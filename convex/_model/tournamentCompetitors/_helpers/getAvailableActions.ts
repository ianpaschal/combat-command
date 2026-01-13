import { getAuthUserId } from '@convex-dev/auth/server';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { checkUserIsTournamentOrganizer } from '../../tournamentOrganizers';
import { getTournamentRegistrationsByCompetitor } from '../../tournamentRegistrations';
import { checkUserIsRegistered } from '../../tournamentRegistrations/_helpers/checkUserIsRegistered';

export enum TournamentCompetitorActionKey {
  // ---- TO Actions ----

  /** Create a TournamentRegistration for a given TournamentCompetitor. */
  AddPlayer = 'addPlayer',

  /** Set a TournamentCompetitor's 'active' field to true or false. */
  ToggleActive = 'toggleActive',

  // TODO
  // TransferPlayers = 'transferPlayers',

  // ---- TO or Captain Actions ----

  /** Edit a TournamentCompetitor. */
  Edit = 'edit',

  /** Delete a TournamentCompetitor. */
  Delete = 'delete',

  // ---- Player Actions ----
  /** Create own TournamentRegistration. */
  Join = 'join',

  /** Delete own TournamentRegistration. */
  Leave = 'leave',
}

/**
 * Gets a list of tournament competitor actions which are available to a user.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.id - ID of the tournament competitor
 * @returns An array of TournamentCompetitorActionKey(s)
 */
export const getAvailableActions = async (
  ctx: QueryCtx,
  doc: Doc<'tournamentCompetitors'>,
): Promise<TournamentCompetitorActionKey[]> => {

  const tournament = await ctx.db.get(doc.tournamentId);
  if (!tournament) {
    return [];
  }
  const tournamentRegistrations = await getTournamentRegistrationsByCompetitor(ctx, {
    tournamentCompetitorId: doc._id,
  });

  // --- CHECK AUTH ----
  const userId = await getAuthUserId(ctx);

  const isOrganizer = await checkUserIsTournamentOrganizer(ctx, tournament._id, userId);
  const isPlayer = await checkUserIsRegistered(ctx, tournament._id, userId);
  const isCaptain = userId && doc.captainUserId === userId;
  const isTeamTournament = tournament.competitorSize > 1;
  const hasSparePlayers = tournamentRegistrations.length > tournament.competitorSize;

  // ---- PRIMARY ACTIONS ----
  const actions: TournamentCompetitorActionKey[] = [];

  if (tournament.status === 'archived') {
    return actions;
  }

  if (isOrganizer || (isCaptain && hasSparePlayers)) {
    actions.push(TournamentCompetitorActionKey.Edit);
  }

  if ((isOrganizer || (isCaptain && isTeamTournament)) && tournament.status !== 'active') {
    actions.push(TournamentCompetitorActionKey.Delete);
  }

  if (isOrganizer && isTeamTournament) {
    actions.push(TournamentCompetitorActionKey.AddPlayer);
  }

  // if (isOrganizer) {
  //   actions.push(TournamentCompetitorActionKey.TransferPlayers);
  // }
  
  if (!isPlayer && tournament.status === 'published' && isTeamTournament) {
    actions.push(TournamentCompetitorActionKey.Join);
  }

  if (isPlayer && ['draft', 'published'].includes(tournament.status) && isTeamTournament) {
    actions.push(TournamentCompetitorActionKey.Leave);
  }

  if (isOrganizer && tournament.status === 'active' && tournament.currentRound === undefined) {
    actions.push(TournamentCompetitorActionKey.ToggleActive);
  }

  return actions;
};
