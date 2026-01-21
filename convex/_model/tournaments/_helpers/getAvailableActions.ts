import { getAuthUserId } from '@convex-dev/auth/server';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { checkUserIsTournamentOrganizer } from '../../tournamentOrganizers';
import { checkUserIsRegistered } from '../../tournamentRegistrations';
import { checkTournamentVisibility } from './checkTournamentVisibility';
import { getTournamentNextRound } from './getTournamentNextRound';

export enum TournamentActionKey {
  // ---- TO Actions ----

  /** Edit a Tournament. */
  Edit = 'edit',

  /** Delete a Tournament. */
  Delete = 'delete',

  /** Set a Tournament's status to 'published'. */
  Publish = 'publish',

  // TODO: UndoPublish

  /** Create a TournamentRegistration (+ TournamentCompetitor). */
  AddPlayer = 'addPlayer',
  
  /** Set a (published) Tournament's status to 'archived', before it starts. */
  Cancel = 'cancel',

  // TODO: UndoCancel

  /** Set a published Tournament's status to 'active'. */
  Start = 'start',

  // TODO: UndoStart

  /** Create TournamentPairings for a given round. */
  ConfigureRound = 'configureRound',

  /** Start a Tournament round. */
  StartRound = 'startRound',

  /** Undo starting a Tournament round. */
  UndoStartRound = 'undoStartRound',

  /** Submit a MatchResult for the given Tournament. */
  SubmitMatchResult = 'submitMatchResult',
  
  /** End a Tournament round. */
  EndRound = 'endRound',

  /** Undo ending a Tournament round. */
  UndoEndRound = 'undoEndRound',

  /** Set a (active) Tournament's status to 'archived'. */
  End = 'end',

  // ---- Player Actions ----

  /** Create own TournamentRegistration (+ TournamentCompetitor). */
  Join = 'join',

  /** Delete own TournamentRegistration (+ TournamentCompetitor). */
  Leave = 'leave',
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
  const nextRound = getTournamentNextRound(doc);
  const nextRoundPairings = await ctx.db.query('tournamentPairings')
    .withIndex('by_tournament_round', (q) => q.eq('tournamentId', doc._id).eq('round', nextRound ?? -1))
    .collect();
  const nextRoundPairingCount = (nextRoundPairings ?? []).length;
  
  const hasNextRound = nextRound !== undefined;
  const hasCurrentRound = doc.currentRound !== undefined;
  const hasLastRound = doc.lastRound !== undefined;
 
  // ---- PRIMARY ACTIONS ----
  const actions: TournamentActionKey[] = [];

  if (doc.status === 'archived') {
    return actions;
  }
 
  // TO Actions:
  if (isOrganizer && doc.status !== 'active') {
    actions.push(TournamentActionKey.Edit);
  }
 
  if (isOrganizer && doc.status !== 'active') {
    actions.push(TournamentActionKey.Delete);
  }
 
  if (isOrganizer && doc.status === 'draft') {
    actions.push(TournamentActionKey.Publish);
  }

  if (isOrganizer && doc.status !== 'draft' && !hasCurrentRound) {
    actions.push(TournamentActionKey.AddPlayer);
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
 
  if (isOrganizer && doc.status === 'active' && hasCurrentRound) {
    actions.push(TournamentActionKey.UndoStartRound);
  }
 
  if ((isOrganizer || isPlayer) && hasCurrentRound) { // TODO: Don't show if all matches checked in
    actions.push(TournamentActionKey.SubmitMatchResult);
  }
 
  if (isOrganizer && doc.status === 'active' && hasCurrentRound) {
    actions.push(TournamentActionKey.EndRound);
  }

  if (isOrganizer && doc.status === 'active' && !hasCurrentRound && hasLastRound) {
    actions.push(TournamentActionKey.UndoEndRound);
  }
 
  if (isOrganizer && doc.status === 'active' && !hasCurrentRound) {
    actions.push(TournamentActionKey.End);
  }

  // Player Actions
  if (!isPlayer && doc.status === 'published') {
    actions.push(TournamentActionKey.Join);
  }
  
  if (isPlayer && doc.status === 'published') {
    actions.push(TournamentActionKey.Leave);
  }
 
  return actions;
};
