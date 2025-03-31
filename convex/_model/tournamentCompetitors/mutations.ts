import { getAuthUserId } from '@convex-dev/auth/server';
import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { getTournamentUserIds } from '../tournaments/helpers';
import { editableFields } from './fields';

// CRUD Operations
export const createTournamentCompetitorArgs = v.object({
  ...editableFields,
});

export const createTournamentCompetitor = async (
  ctx: MutationCtx,
  args: Infer<typeof createTournamentCompetitorArgs>,
) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError(getErrorMessage('USER_NOT_AUTHENTICATED'));
  }
  const tournament = await ctx.db.get(args.tournamentId);
  const competitors = await ctx.db.query('tournamentCompetitors').withIndex('by_tournament_id').collect();
  const registeredUserIds = await getTournamentUserIds(ctx, args.tournamentId);
  const players = args.players.length ? args.players : [{ userId, active: true }];
  const unregisteredUserIds = players.map((player) => player.userId);

  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }

  if (tournament.status === 'archived') {
    throw new ConvexError(getErrorMessage('CANNOT_MODIFY_ARCHIVED_TOURNAMENT'));
  }

  if (tournament.maxCompetitors === competitors.length) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_HAS_MAX_COMPETITORS'));
  }

  if (args.teamName && competitors.map((c) => c.teamName).includes(args.teamName)) {
    throw new ConvexError(getErrorMessage('TEAM_ALREADY_IN_TOURNAMENT'));
  }

  if (unregisteredUserIds.some((userId) => registeredUserIds.has(userId))) {
    throw new ConvexError(getErrorMessage('USER_ALREADY_IN_TOURNAMENT'));
  }

  return await ctx.db.insert('tournamentCompetitors', {
    ...args,
    players: args.players.length ? args.players : [{ userId, active: true }], 
  });
};

export const updateTournamentCompetitorArgs = v.object({
  id: v.id('tournamentCompetitors'),
  ...editableFields,
});

export const updateTournamentCompetitor = async (
  ctx: MutationCtx,
  { id, tournamentId, ...args }: Infer<typeof updateTournamentCompetitorArgs>,
) => {
  const tournament = await ctx.db.get(tournamentId);
  if (tournament) {
    if (tournament.status === 'archived') {
      throw new ConvexError(getErrorMessage('CANNOT_MODIFY_ARCHIVED_TOURNAMENT'));
    }
    await ctx.db.patch(id, {
      ...args,
      modifiedAt: Date.now(),
    });
  }
};

// Actions
export const addPlayerToTournamentCompetitorArgs = v.object({
  tournamentCompetitorId: v.id('tournamentCompetitors'),
  playerUserId: v.id('users'),
});

export const addPlayerToTournamentCompetitor = async (
  ctx: MutationCtx,
  args: Infer<typeof addPlayerToTournamentCompetitorArgs>,
) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError(getErrorMessage('USER_NOT_AUTHENTICATED'));
  }
  const tournamentCompetitor = await ctx.db.get(args.tournamentCompetitorId);
  if (!tournamentCompetitor) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_COMPETITOR_NOT_FOUND'));
  }
  const tournament = await ctx.db.get(tournamentCompetitor.tournamentId);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_CONTAINING_COMPETITOR_NOT_FOUND'));
  }
  if (userId !== args.playerUserId && !tournament?.organizerUserIds.includes(userId)) {
    throw new ConvexError(getErrorMessage('CANNOT_ADD_ANOTHER_PLAYER'));
  }
  return await ctx.db.patch(args.tournamentCompetitorId, {
    players: [
      ...tournamentCompetitor.players,
      {
        userId: args.playerUserId,
        active: true,
      },
    ],
  });
};

export const removePlayerFromTournamentCompetitorArgs = v.object({
  tournamentCompetitorId: v.id('tournamentCompetitors'),
  playerUserId: v.id('users'),
});

export const removePlayerFromTournamentCompetitor = async (
  ctx: MutationCtx,
  args: Infer<typeof removePlayerFromTournamentCompetitorArgs>,
) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError(getErrorMessage('USER_NOT_AUTHENTICATED'));
  }
  const tournamentCompetitor = await ctx.db.get(args.tournamentCompetitorId);
  if (!tournamentCompetitor) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_COMPETITOR_NOT_FOUND'));
  }
  const tournament = await ctx.db.get(tournamentCompetitor.tournamentId);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_CONTAINING_COMPETITOR_NOT_FOUND'));
  }
  if (userId !== args.playerUserId && !tournament?.organizerUserIds.includes(userId)) {
    throw new ConvexError(getErrorMessage('CANNOT_REMOVE_ANOTHER_PLAYER'));
  }
  
  // If this is the last player, delete the competitor
  if (tournamentCompetitor.players.length === 1) {
    return await ctx.db.delete(args.tournamentCompetitorId);
  }

  // Otherwise remove the player
  return await ctx.db.patch(args.tournamentCompetitorId, {
    players: tournamentCompetitor.players.filter((player) => player.userId === args.playerUserId),
  });
};
