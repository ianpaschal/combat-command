import { mutation, query } from './_generated/server';
import {
  getTournamentTimer as getTournamentTimerHandler,
  getTournamentTimerArgs,
  pauseTournamentTimer as pauseTournamentTimerHandler,
  pauseTournamentTimerArgs,
  resetTournamentTimer as resetTournamentTimerHandler,
  resetTournamentTimerArgs,
  startTournamentTimer as startTournamentTimerHandler,
  startTournamentTimerArgs,
} from './_model/tournamentTimers';

export const getTournamentTimer = query({
  args: getTournamentTimerArgs,
  handler: getTournamentTimerHandler,
});

// Actions
export const startTournamentTimer = mutation({
  args: startTournamentTimerArgs,
  handler: startTournamentTimerHandler,
});
export const resetTournamentTimer = mutation({
  args: resetTournamentTimerArgs,
  handler: resetTournamentTimerHandler,
});
export const pauseTournamentTimer = mutation({
  args: pauseTournamentTimerArgs,
  handler: pauseTournamentTimerHandler,
});
