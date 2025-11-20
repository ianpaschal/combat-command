import { mutation, query } from './_generated/server';
import * as model from './_model/tournamentCompetitors';
import { mutationWithTrigger } from './functions';

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

export const updateTournamentCompetitor = mutationWithTrigger({
  args: model.updateTournamentCompetitorArgs,
  handler: model.updateTournamentCompetitor,
});

export const deleteTournamentCompetitor = mutation({
  args: model.deleteTournamentCompetitorArgs,
  handler: model.deleteTournamentCompetitor,
});

// Actions
export const toggleTournamentCompetitorActive = mutation({
  args: model.toggleTournamentCompetitorActiveArgs,
  handler: model.toggleTournamentCompetitorActive,
});
