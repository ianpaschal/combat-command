import { getAuthUserId } from '@convex-dev/auth/server';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getMatchResultsByTournamentRound } from '../../matchResults';
import { checkUserIsTournamentOrganizer } from '../../tournamentOrganizers';
import { checkUserIsRegistered } from '../../tournamentRegistrations';
import { checkTournamentVisibility } from './checkTournamentVisibility';
import { getTournamentNextRound } from './getTournamentNextRound';

export enum TournamentActionKey {
  Cancel = 'cancel',
  ConfigureRound = 'configureRound',
  AddPlayer = 'addPlayer', // Create TournamentRegistration (+ TournamentCompetitor) as TO
  Delete = 'delete',
  Edit = 'edit',
  End = 'end',
  EndRound = 'endRound',
  Join = 'join', // Create TournamentRegistration (+ TournamentCompetitor) as player
  Leave = 'leave', // Delete TournamentRegistration (+ TournamentCompetitor) as player
  Publish = 'publish',
  ResetRound = 'resetRound',
  Start = 'start',
  StartRound = 'startRound',
  SubmitMatchResult = 'submitMatchResult',
  UndoEndRound = 'undoEndRound',
  UndoStartRound = 'undoStartRound',
}

/**
 * Gets a list of tournament actions which are available to a user.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.id - ID of the tournament
 * @returns An array of TournamentActionKey(s)
 */
export const getAvailableActions = async (
  ctx: QueryCtx,
  doc: Doc<'tournaments'>,
): Promise<TournamentActionKey[]> => {

  // --- CHECK AUTH ----
  const userId = await getAuthUserId(ctx);
  if (!(await checkTournamentVisibility(ctx, doc))) {
    return [];
  }
  const isOrganizer = await checkUserIsTournamentOrganizer(ctx, doc._id, userId);
  const isPlayer = await checkUserIsRegistered(ctx, doc._id, userId);
 
  // ---- GATHER DATA ----
  const hasCurrentRound = doc.currentRound !== undefined;
 
  const nextRound = getTournamentNextRound(doc);
  const hasNextRound = nextRound !== undefined;
 
  const nextRoundPairings = await ctx.db.query('tournamentPairings')
    .withIndex('by_tournament_round', (q) => q.eq('tournamentId', doc._id).eq('round', nextRound ?? -1))
    .collect();
  const nextRoundPairingCount = (nextRoundPairings ?? []).length;
 
  const currentRoundMatchResults = await getMatchResultsByTournamentRound(ctx, {
    tournamentId: doc._id,
    round: doc.currentRound ?? 0,
  });
  const currentRoundMatchResultCount = (currentRoundMatchResults ?? []).length;
 
  // ---- PRIMARY ACTIONS ----
  const actions: TournamentActionKey[] = [];
 
  if (isOrganizer && ['draft', 'published'].includes(doc.status)) {
    actions.push(TournamentActionKey.Edit);
  }
 
  if (isOrganizer && ['draft', 'published'].includes(doc.status)) {
    actions.push(TournamentActionKey.Delete);
  }
 
  if (isOrganizer && doc.status === 'draft') {
    actions.push(TournamentActionKey.Publish);
  }

  if (isOrganizer && doc.status === 'published') {
    actions.push(TournamentActionKey.AddPlayer);
  }
  
  if (!isPlayer && doc.status === 'published') {
    actions.push(TournamentActionKey.Join);
  }
  
  if (isPlayer && doc.status === 'published') {
    actions.push(TournamentActionKey.Leave);
  }
 
  if (isOrganizer && doc.status === 'published') { // TODO: Check for at least 2 competitors
    actions.push(TournamentActionKey.Start);
  }
 
  if (isOrganizer && doc.status === 'active' && !hasCurrentRound && hasNextRound) {
    actions.push(TournamentActionKey.ConfigureRound);
  }
 
  if (isOrganizer && doc.status === 'active' && !hasCurrentRound && hasNextRound && nextRoundPairingCount > 0) {
    actions.push(TournamentActionKey.StartRound);
  }
 
  if (isOrganizer && doc.status === 'active' && hasCurrentRound && currentRoundMatchResultCount === 0) {
    actions.push(TournamentActionKey.ResetRound);
  }
 
  if ((isOrganizer || isPlayer) && hasCurrentRound) { // TODO: Don't show if all matches checked in
    actions.push(TournamentActionKey.SubmitMatchResult);
  }
 
  if (isOrganizer && hasCurrentRound) {
    actions.push(TournamentActionKey.EndRound);
  }
 
  if (isOrganizer && doc.status === 'active' && !hasCurrentRound) {
    actions.push(TournamentActionKey.End);
  }
 
  return actions;
};
