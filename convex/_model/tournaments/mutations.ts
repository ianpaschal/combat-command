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
    if (args.useNationalTeams !== tournament.useNationalTeams) {
      // TODO: Throw
    }
  }

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

export const publishTournament = async (
  ctx: MutationCtx,
  { id }: Infer<typeof publishTournamentArgs>,
) => await ctx.db.patch(id, {
  status: 'published',
});
