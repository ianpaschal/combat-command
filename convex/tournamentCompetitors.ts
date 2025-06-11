import { mutation, query } from './_generated/server';
import * as model from './_model/tournamentCompetitors';

export const getTournamentCompetitor = query({
  args: model.getTournamentCompetitorArgs,
  handler: model.getTournamentCompetitor,
});

export const getTournamentCompetitors = query({
  args: {},
  handler: model.getTournamentCompetitors,
});

export const getTournamentCompetitorsByTournament = query({
  args: model.getTournamentCompetitorsByTournamentArgs,
  handler: model.getTournamentCompetitorsByTournament,
});

// CRUD Operations
export const createTournamentCompetitor = mutation({
  args: model.createTournamentCompetitorArgs,
  handler: model.createTournamentCompetitor,
});

export const updateTournamentCompetitor = mutation({
  args: model.updateTournamentCompetitorArgs,
  handler: model.updateTournamentCompetitor,
});

// Actions
export const addTournamentCompetitorPlayer = mutation({
  args: model.addTournamentCompetitorPlayerArgs,
  handler: model.addTournamentCompetitorPlayer,
});

export const removeTournamentCompetitorPlayer = mutation({
  args: model.removeTournamentCompetitorPlayerArgs,
  handler: model.removeTournamentCompetitorPlayer,
});

export const toggleTournamentCompetitorActive = mutation({
  args: model.toggleTournamentCompetitorActiveArgs,
  handler: model.toggleTournamentCompetitorActive,
});
