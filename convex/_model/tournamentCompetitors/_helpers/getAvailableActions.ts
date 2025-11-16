import { getAuthUserId } from '@convex-dev/auth/server';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { checkUserIsTournamentOrganizer } from '../../tournamentOrganizers';
import { getTournamentRegistrationsByCompetitor } from '../../tournamentRegistrations';
import { checkUserIsRegistered } from '../../tournamentRegistrations/_helpers/checkUserIsRegistered';

export enum TournamentCompetitorActionKey {
  AddPlayer = 'addPlayer',
  Delete = 'delete',
  Edit = 'edit',
  Join = 'join',
  Leave = 'leave',
  TransferPlayers = 'transferPlayers',
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
  const hasSparePlayers = tournamentRegistrations.length > tournament.competitorSize;

  // ---- PRIMARY ACTIONS ----
  const actions: TournamentCompetitorActionKey[] = [];

  if (tournament.status === 'archived') {
    return actions;
  }

  if (isOrganizer || (isCaptain && hasSparePlayers)) {
    actions.push(TournamentCompetitorActionKey.Edit);
  }

  if ((isOrganizer || (isCaptain && tournament.competitorSize > 1)) && tournament.status !== 'active') {
    actions.push(TournamentCompetitorActionKey.Delete);
  }

  if (isOrganizer) {
    actions.push(TournamentCompetitorActionKey.AddPlayer);
  }

  if (isOrganizer) {
    actions.push(TournamentCompetitorActionKey.TransferPlayers);
  }
  
  if (!isPlayer && tournament.status === 'published' && tournament.competitorSize > 1) {
    actions.push(TournamentCompetitorActionKey.Join);
  }

  if (isPlayer && ['draft', 'published'].includes(tournament.status)) {
    actions.push(TournamentCompetitorActionKey.Leave);
  }

  return actions;
};
