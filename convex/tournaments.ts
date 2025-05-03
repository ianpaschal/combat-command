import { mutation, query } from './_generated/server';
import {
  checkInPlayer as checkInPlayerHandler,
  checkInPlayerArgs,
  createTournament as createTournamentHandler,
  createTournamentArgs,
  deleteTournament as deleteTournamentHandler,
  deleteTournamentArgs,
  getTournament as getTournamentHandler,
  getTournamentArgs,
  getTournamentList as getTournamentListHandler,
  publishTournament as publishTournamentHandler,
  publishTournamentArgs,
  startTournament as startTournamentHandler,
  startTournamentArgs,
  updateTournament as updateTournamentHandler,
  updateTournamentArgs,
} from './_model/tournaments';

export const getTournament = query({
  args: getTournamentArgs,
  handler: getTournamentHandler,
});

export const getTournamentList = query({
  args: {},
  handler: getTournamentListHandler,
});

// CRUD Operations
export const createTournament = mutation({
  args: createTournamentArgs,
  handler: createTournamentHandler,
});

export const updateTournament = mutation({
  args: updateTournamentArgs,
  handler: updateTournamentHandler,
});

export const deleteTournament = mutation({
  args: deleteTournamentArgs,
  handler: deleteTournamentHandler,
});

// Actions
export const publishTournament = mutation({
  args: publishTournamentArgs,
  handler: publishTournamentHandler,
});

export const startTournament = mutation({
  args: startTournamentArgs,
  handler: startTournamentHandler,
});

export const checkInPlayer = mutation({
  args: checkInPlayerArgs,
  handler: checkInPlayerHandler,
});
