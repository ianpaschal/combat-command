import { getAuthUserId } from '@convex-dev/auth/server';
import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { TournamentActionKey } from '..';
import { checkTournamentVisibility } from '../_helpers/checkTournamentVisibility';
import { getTournamentNextRound } from '../_helpers/getTournamentNextRound';
import { getTournamentPlayerUserIds } from '../_helpers/getTournamentPlayerUserIds';

export const getAvailableTournamentActionsArgs = v.object({
  id: v.id('tournaments'),
});

/**
 * Gets a list of tournament actions which are available to a user.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.id - ID of the tournament
 * @returns An array of TournamentActionKey(s)
 */
export const getAvailableTournamentActions = async (
  ctx: QueryCtx,
  args: Infer<typeof getAvailableTournamentActionsArgs>,
): Promise<TournamentActionKey[]> => {
  const tournament = await ctx.db.get(args.id);
  if (!tournament) {
    return [];
  }

  // --- CHECK AUTH ----
  const userId = await getAuthUserId(ctx);
  if (!(await checkTournamentVisibility(ctx, tournament))) {
    return [];
  }

  // ---- GATHER DATA ----
  const nextRound = getTournamentNextRound(tournament);
  const nextRoundPairings = await ctx.db.query('tournamentPairings')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', args.id))
    .collect();
  const nextRoundPairingCount = (nextRoundPairings ?? []).length;
  const playerUserIds = await getTournamentPlayerUserIds(ctx, tournament._id);

  const isOrganizer = !!userId && tournament.organizerUserIds.includes(userId);
  const isPlayer = !!userId && playerUserIds.includes(userId);

  const hasCurrentRound = tournament.currentRound !== undefined;
  const hasNextRound = nextRound !== undefined;

  // ---- PRIMARY ACTIONS ----
  const actions: TournamentActionKey[] = [];

  if (isOrganizer && ['draft', 'published'].includes(tournament.status)) {
    actions.push(TournamentActionKey.Edit);
  }

  if (isOrganizer && tournament.status === 'draft') {
    actions.push(TournamentActionKey.Delete);
  }
      
  if (isOrganizer && tournament.status === 'draft') {
    actions.push(TournamentActionKey.Publish);
  }

  if (isOrganizer && tournament.status === 'published') { // TODO: Check for at least 2 competitors
    actions.push(TournamentActionKey.Start);
  }

  if (isOrganizer && !hasCurrentRound && hasNextRound && nextRoundPairingCount === 0) {
    actions.push(TournamentActionKey.ConfigureRound);
  }

  if (isOrganizer && !hasCurrentRound && hasNextRound && nextRoundPairingCount > 0) {
    actions.push(TournamentActionKey.StartRound);
  }

  if ((isOrganizer || isPlayer) && hasCurrentRound) { // TODO: Don't show if all matches checked in
    actions.push(TournamentActionKey.SubmitMatchResult);
  }

  if (isOrganizer && hasCurrentRound) {
    actions.push(TournamentActionKey.EndRound);
  }

  if (isOrganizer && !hasCurrentRound) {
    actions.push(TournamentActionKey.End);
  }

  return actions;
};
