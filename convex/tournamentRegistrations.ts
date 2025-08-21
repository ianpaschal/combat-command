import { mutation, query } from './_generated/server';
import * as model from './_model/tournamentRegistrations';

export const getTournamentRegistrationsByCompetitor = query({
  args: model.getTournamentRegistrationsByCompetitorArgs,
  handler: model.getTournamentRegistrationsByCompetitor,
});

export const getTournamentRegistrationsByUser = query({
  args: model.getTournamentRegistrationsByUserArgs,
  handler: model.getTournamentRegistrationsByUser,
});

export const getTournamentRegistrationsByTournament = query({
  args: model.getTournamentRegistrationsByTournamentArgs,
  handler: model.getTournamentRegistrationsByTournament,
});

// CRUD Operations
export const createTournamentRegistration = mutation({
  args: model.createTournamentRegistrationArgs,
  handler: model.createTournamentRegistration,
});

export const deleteTournamentRegistration = mutation({
  args: model.deleteTournamentRegistrationArgs,
  handler: model.deleteTournamentRegistration,
});

// Actions
export const toggleTournamentRegistrationActive = mutation({
  args: model.toggleTournamentRegistrationActiveArgs,
  handler: model.toggleTournamentRegistrationActive,
});
