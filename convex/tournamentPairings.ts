import { mutation, query } from './_generated/server';
import {
  commitTournamentPairings as commitTournamentPairingsHandler,
  commitTournamentPairingsArgs,
  getDraftTournamentPairings as getDraftTournamentPairingsHandler,
  getDraftTournamentPairingsArgs,
  getTournamentPairing as getTournamentPairingHandler,
  getTournamentPairingArgs,
  getTournamentPairings as getTournamentPairingsHandler,
  getTournamentPairingsArgs,
} from './_model/tournamentPairings';

export const getTournamentPairing = query({
  args: getTournamentPairingArgs,
  handler: getTournamentPairingHandler,
});

export const getTournamentPairings = query({
  args: getTournamentPairingsArgs,
  handler: getTournamentPairingsHandler,
});

export const getDraftTournamentPairings = query({
  args: getDraftTournamentPairingsArgs,
  handler: getDraftTournamentPairingsHandler,
});

// C_UD
export const commitTournamentPairings = mutation({
  args: commitTournamentPairingsArgs,
  handler: commitTournamentPairingsHandler,
});
