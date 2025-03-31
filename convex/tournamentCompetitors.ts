import { mutation, query } from './_generated/server';
import {
  addPlayerToTournamentCompetitor as addPlayerToTournamentCompetitorHandler,
  addPlayerToTournamentCompetitorArgs,
  createTournamentCompetitor as createTournamentCompetitorHandler,
  createTournamentCompetitorArgs,
  getTournamentCompetitor as getTournamentCompetitorHandler,
  getTournamentCompetitorArgs,
  getTournamentCompetitorList as getTournamentCompetitorListHandler,
  getTournamentCompetitorListByTournamentId as getTournamentCompetitorListByTournamentIdHandler,
  getTournamentCompetitorListByTournamentIdArgs,
  removePlayerFromTournamentCompetitor as removePlayerFromTournamentCompetitorHandler,
  removePlayerFromTournamentCompetitorArgs,
  updateTournamentCompetitor as updateTournamentCompetitorHandler,
  updateTournamentCompetitorArgs,
} from './_model/tournamentCompetitors';

export const getTournamentCompetitor = query({
  args: getTournamentCompetitorArgs,
  handler: getTournamentCompetitorHandler,
});

export const getTournamentCompetitorList = query({
  args: {},
  handler: getTournamentCompetitorListHandler,
});

export const getTournamentCompetitorListByTournamentId = query({
  args: getTournamentCompetitorListByTournamentIdArgs,
  handler: getTournamentCompetitorListByTournamentIdHandler,
});

// CRUD Operations
export const createTournamentCompetitor = mutation({
  args: createTournamentCompetitorArgs,
  handler: createTournamentCompetitorHandler,
});

export const updateTournamentCompetitor = mutation({
  args: updateTournamentCompetitorArgs,
  handler: updateTournamentCompetitorHandler,
});

// Actions
export const addPlayerToTournamentCompetitor = mutation({
  args: addPlayerToTournamentCompetitorArgs,
  handler: addPlayerToTournamentCompetitorHandler,
});

export const removePlayerFromTournamentCompetitor = mutation({
  args: removePlayerFromTournamentCompetitorArgs,
  handler: removePlayerFromTournamentCompetitorHandler,
});
