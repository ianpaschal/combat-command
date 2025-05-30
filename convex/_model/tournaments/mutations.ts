import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { editableFields } from './fields';

// CRUD Operations
export const createTournamentArgs = v.object({
  ...editableFields,
});

export const createTournament = async (
  ctx: MutationCtx,
  args: Infer<typeof createTournamentArgs>,
) => await ctx.db.insert('tournaments', {
  ...args,
  status: 'draft',
});

export const updateTournamentArgs = v.object({
  id: v.id('tournaments'),
  ...editableFields,
});

export const updateTournament = async (
  ctx: MutationCtx,
  { id, ...args }: Infer<typeof updateTournamentArgs>,
) => {
  const tournament = await ctx.db.get(id);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }
  if (tournament.logoStorageId && args.logoStorageId === null) {
    await ctx.storage.delete(tournament.logoStorageId);
    // Don't throw an error here... even if the file doesn't delete the changes can be saved
  }
  if (tournament.bannerStorageId && args.bannerStorageId === null) {
    await ctx.storage.delete(tournament.bannerStorageId);
    // Don't throw an error here... even if the file doesn't delete the changes can be saved
  }

  if (tournament.status !== 'draft') {
    if (args.competitorSize !== tournament.competitorSize) {
      // TODO: Throw
    }
    if (args.maxCompetitors !== tournament.maxCompetitors) {
      // TODO: Throw
    }
    if (args.useNationalTeams !== tournament.useNationalTeams) {
      // TODO: Throw
    }
  }
  // TODO: Add checks for active tournament and ranking factors

  return await ctx.db.patch(id, {
    ...args,
    modifiedAt: Date.now(),
  });
};

export const deleteTournamentArgs = v.object({
  id: v.id('tournaments'),
});

export const deleteTournament = async (
  ctx: MutationCtx,
  { id }: Infer<typeof deleteTournamentArgs>,
) => {
  const tournament = await ctx.db.get(id);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }
  if (tournament.status === 'active') {
    throw new ConvexError(getErrorMessage('CANNOT_DELETE_ACTIVE_TOURNAMENT'));
  }
  if (tournament.status === 'archived') {
    throw new ConvexError(getErrorMessage('CANNOT_DELETE_ARCHIVED_TOURNAMENT'));
  }

  // Delete the tournament
  await ctx.db.delete(id);

  // Cascade
  const tournamentCompetitors = await ctx.db.query('tournamentCompetitors').withIndex('by_tournament_id', (q) => q.eq('tournamentId', id)).collect();
  tournamentCompetitors.forEach( async (tournamentCompetitor) => {
    await ctx.db.delete(tournamentCompetitor._id);
  });

  const tournamentPairings = await ctx.db.query('tournamentPairings').withIndex('by_tournament_id', (q) => q.eq('tournamentId', id)).collect();
  tournamentPairings.forEach( async (tournamentPairing) => {
    await ctx.db.delete(tournamentPairing._id);
  });
};

// Actions
export const publishTournamentArgs = v.object({
  id: v.id('tournaments'),
});

// TODO: Throw error if status is not draft
export const publishTournament = async (
  ctx: MutationCtx,
  { id }: Infer<typeof publishTournamentArgs>,
) => await ctx.db.patch(id, {
  status: 'published',
});

export const startTournamentArgs = v.object({
  id: v.id('tournaments'),
});

// TODO: Throw error if status is not published
export const startTournament = async (
  ctx: MutationCtx,
  { id }: Infer<typeof startTournamentArgs>,
) => await ctx.db.patch(id, {
  status: 'active',
});

export const closeTournamentRound = async (
  ctx: MutationCtx,
  { id }: Infer<typeof startTournamentArgs>,
) => {
  const tournament = await ctx.db.get(id);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }
  if (tournament.status !== 'active') {
    throw new ConvexError(getErrorMessage('CANNOT_ADVANCE_INACTIVE_TOURNAMENT'));
  }
  if (tournament.currentRound === undefined) {
    throw new ConvexError(getErrorMessage('CANNOT_END_NON_EXISTENT_TOURNAMENT_ROUND'));
  }
  await ctx.db.patch(id, {
    lastRound: tournament.currentRound,
    currentRound: undefined,
  });

  // TODO: Clean up timer
};

export const advanceTournamentRound = async (
  ctx: MutationCtx,
  { id }: Infer<typeof startTournamentArgs>,
) => {
  const tournament = await ctx.db.get(id);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }
  if (tournament.status !== 'active') {
    throw new ConvexError(getErrorMessage('CANNOT_ADVANCE_INACTIVE_TOURNAMENT'));
  }

  const nextRound = !tournament.lastRound ? 0 : tournament.lastRound++;
  
  await ctx.db.patch(id, {
    currentRound: nextRound,
  });

  await ctx.db.insert('tournamentTimers', {
    pausedAt: null,
    pauseTime: 0,
    round: nextRound,
    startedAt: null,
    tournamentId: tournament._id,
  });

  return nextRound;
};
