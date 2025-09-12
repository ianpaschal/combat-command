import { getAuthUserId } from '@convex-dev/auth/server';
import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { checkUserIsTournamentOrganizer } from '../../tournamentOrganizers';
import { checkTournamentVisibility } from '../../tournaments';
import { checkUserIsCaptain } from '../_helpers/checkUserIsCaptain';
import { checkUserIsPlayer } from '../_helpers/checkUserIsPlayer';
import { TournamentCompetitorActionKey } from '../types';

export const getAvailableTournamentCompetitorActionsArgs = v.object({
  tournamentId: v.id('tournaments'),
  tournamentCompetitorId: v.id('tournamentCompetitors'),
});

export const getAvailableTournamentCompetitorActions = async (
  ctx: QueryCtx,
  args: Infer<typeof getAvailableTournamentCompetitorActionsArgs>,
): Promise<TournamentCompetitorActionKey[]> => {
  const tournament = await ctx.db.get(args.tournamentId);
  if (!tournament) {
    return [];
  }
  const tournamentCompetitor = await ctx.db.get(args.tournamentCompetitorId);
  if (!tournamentCompetitor) {
    return [];
  }

  // --- CHECK AUTH ----
  const userId = await getAuthUserId(ctx);
  if (!(await checkTournamentVisibility(ctx, tournament))) {
    return [];
  }
  const isOrganizer = await checkUserIsTournamentOrganizer(ctx, args.tournamentId, userId);
  const isCaptain = await checkUserIsCaptain(ctx, args.tournamentCompetitorId, userId);
  const isPlayer = await checkUserIsPlayer(ctx, args.tournamentCompetitorId, userId);

  // ---- GATHER DATA ----

  // ---- PRIMARY ACTIONS ----
  const actions: TournamentCompetitorActionKey[] = [];

  if ((isOrganizer || isCaptain) && tournament.status !== 'archived' && tournament.currentRound === undefined) {
    actions.push(TournamentCompetitorActionKey.Edit);
  }

  if (isPlayer && tournament.status === 'published') {
    actions.push(TournamentCompetitorActionKey.Leave);
  }

  if (isOrganizer && tournament.status === 'published') {
    actions.push(TournamentCompetitorActionKey.Remove);
  }

  return actions;
};
