import { mutation, query } from './_generated/server';
import * as model from './_model/tournamentResults';

// Mutations
export const refreshTournamentResult = mutation({
  args: model.refreshTournamentResultArgs,
  handler: model.refreshTournamentResult,
});

// Queries
export const getTournamentResultsByCompetitor = query({
  args: model.getTournamentResultsByCompetitorArgs,
  handler: model.getTournamentResultsByCompetitor,
});

export const getTournamentResultsByGameSystem = query({
  args: model.getTournamentResultsByGameSystemArgs,
  handler: model.getTournamentResultsByGameSystem,
});

export const getTournamentResultsByRound = query({
  args: model.getTournamentResultsByRoundArgs,
  handler: model.getTournamentResultsByRound,
});
