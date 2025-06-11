import { mutation, query } from './_generated/server';
import * as model from './_model/tournamentTimers';

// Queries
export const getTournamentTimer = query({
  args: model.getTournamentTimerArgs,
  handler: model.getTournamentTimer,
});
export const getTournamentTimerByTournament = query({
  args: model.getTournamentTimerByTournamentArgs,
  handler: model.getTournamentTimerByTournament,
});

// Actions
export const toggleTournamentTimer = mutation({
  args: model.toggleTournamentTimerArgs,
  handler: model.toggleTournamentTimer,
});
export const setTournamentTimerPhase = mutation({
  args: model.setTournamentTimerPhaseArgs,
  handler: model.setTournamentTimerPhase,
});
