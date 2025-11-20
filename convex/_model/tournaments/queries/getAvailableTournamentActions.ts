import { getAuthUserId } from '@convex-dev/auth/server';
import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { getMatchResultsByTournamentRound } from '../../matchResults';
import { checkUserIsTournamentOrganizer } from '../../tournamentOrganizers';
import { checkUserIsRegistered } from '../../tournamentRegistrations/_helpers/checkUserIsRegistered';
import { TournamentActionKey } from '..';
import { checkTournamentVisibility } from '../_helpers/checkTournamentVisibility';
import { getTournamentNextRound } from '../_helpers/getTournamentNextRound';

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
  const isOrganizer = await checkUserIsTournamentOrganizer(ctx, args.id, userId);
  const isPlayer = await checkUserIsRegistered(ctx, args.id, userId);

  // ---- GATHER DATA ----
  const hasCurrentRound = tournament.currentRound !== undefined;

  const nextRound = getTournamentNextRound(tournament);
  const hasNextRound = nextRound !== undefined;

  const nextRoundPairings = await ctx.db.query('tournamentPairings')
    .withIndex('by_tournament_round', (q) => q.eq('tournamentId', args.id).eq('round', nextRound ?? -1))
    .collect();
  const nextRoundPairingCount = (nextRoundPairings ?? []).length;

  const currentRoundMatchResults = await getMatchResultsByTournamentRound(ctx, {
    tournamentId: tournament._id,
    round: tournament.currentRound ?? 0,
  });
  const currentRoundMatchResultCount = (currentRoundMatchResults ?? []).length;

  // ---- PRIMARY ACTIONS ----
  const actions: TournamentActionKey[] = [];

  if (isOrganizer && ['draft', 'published'].includes(tournament.status)) {
    actions.push(TournamentActionKey.Edit);
  }

  if (isOrganizer && ['draft', 'published'].includes(tournament.status)) {
    actions.push(TournamentActionKey.Delete);
  }

  if (isOrganizer && tournament.status === 'draft') {
    actions.push(TournamentActionKey.Publish);
  }

  if (isOrganizer && tournament.status === 'published') { // TODO: Check for at least 2 competitors
    actions.push(TournamentActionKey.Start);
  }

  if (isOrganizer && tournament.status === 'active' && !hasCurrentRound && hasNextRound) {
    actions.push(TournamentActionKey.ConfigureRound);
  }

  if (isOrganizer && tournament.status === 'active' && !hasCurrentRound && hasNextRound && nextRoundPairingCount > 0) {
    actions.push(TournamentActionKey.StartRound);
  }

  if (isOrganizer && tournament.status === 'active' && hasCurrentRound && currentRoundMatchResultCount === 0) {
    actions.push(TournamentActionKey.UndoStartRound);
  }

  if ((isOrganizer || isPlayer) && hasCurrentRound) { // TODO: Don't show if all matches checked in
    actions.push(TournamentActionKey.SubmitMatchResult);
  }

  if (isOrganizer && hasCurrentRound) {
    actions.push(TournamentActionKey.EndRound);
  }

  if (isOrganizer && tournament.status === 'active' && !hasCurrentRound) {
    actions.push(TournamentActionKey.End);
  }

  return actions;
};
