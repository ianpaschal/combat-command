import { getAuthUserId } from '@convex-dev/auth/server';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { checkUserIsTournamentOrganizer } from '../../tournamentOrganizers';
import { checkUserIsRegistered } from '../../tournamentRegistrations/_helpers/checkUserIsRegistered';

export enum TournamentCompetitorActionKey {
  // ---- TO Actions ----

  /** Create a TournamentRegistration for this TournamentCompetitor. */
  AddPlayer = 'addPlayer',

  /** Toggle this TournamentCompetitor's 'active' field to true or false. */
  ToggleActive = 'toggleActive',

  // ---- TO or Captain Actions ----

  /** Edit this TournamentCompetitor. */
  Edit = 'edit',

  /** Delete this TournamentCompetitor. */
  Delete = 'delete',

  // ---- Player Actions ----
  /** Create own TournamentRegistration for this TournamentCompetitor. */
  Join = 'join',

  /** Delete own TournamentRegistration for this TournamentCompetitor. */
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
  const tournamentRegistrations = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_tournament_competitor', (q) => q.eq('tournamentCompetitorId', doc._id))
    .collect();

  // --- CHECK AUTH ----
  const userId = await getAuthUserId(ctx);

  const isOrganizer = await checkUserIsTournamentOrganizer(ctx, tournament._id, userId);
  const isPlayer = await checkUserIsRegistered(ctx, tournament._id, userId);
  const isTeamTournament = tournament.competitorSize > 1;
  const isCaptain = isTeamTournament && userId && doc.captainUserId === userId;
  const isTeamPlayer = tournamentRegistrations.find((r) => r.userId === userId);
  const hasCurrentRound = tournament.currentRound !== undefined;

  // ---- PRIMARY ACTIONS ----
  const actions: TournamentCompetitorActionKey[] = [];

  if (tournament.status === 'archived') {
    return actions;
  }

  // TO Actions:
  if (isOrganizer && tournament.status !== 'draft' && isTeamTournament && !hasCurrentRound) {
    actions.push(TournamentCompetitorActionKey.AddPlayer);
  }

  if (isOrganizer && tournament.status === 'active' && !hasCurrentRound) {
    actions.push(TournamentCompetitorActionKey.ToggleActive);
  }

  // TO or Captain Actions:
  if (isOrganizer || (isCaptain && tournament.status === 'published')) {
    actions.push(TournamentCompetitorActionKey.Edit);
  }

  if ((isOrganizer || isCaptain) && tournament.status === 'published') {
    actions.push(TournamentCompetitorActionKey.Delete);
  }
  
  // Player Actions:
  if (!isPlayer && tournament.status === 'published' && isTeamTournament) {
    actions.push(TournamentCompetitorActionKey.Join);
  }

  if (isTeamPlayer && tournament.status === 'published') {
    actions.push(TournamentCompetitorActionKey.Leave);
  }

  return actions;
};
