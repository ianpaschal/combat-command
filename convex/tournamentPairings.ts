import { mutation, query } from './_generated/server';
import {
  createTournamentPairings as createTournamentPairingsHandler,
  createTournamentPairingsArgs,
  getTournamentPairing as getTournamentPairingHandler,
  getTournamentPairingArgs,
  getTournamentPairingList as getTournamentPairingListHandler,
  getTournamentPairingListArgs,
} from './_model/tournamentPairings';

export const getTournamentPairing = query({
  args: getTournamentPairingArgs,
  handler: getTournamentPairingHandler,
});

export const getTournamentPairingList = query({
  args: getTournamentPairingListArgs,
  handler: getTournamentPairingListHandler,
});

// CRUD
export const createTournamentPairings = mutation({
  args: createTournamentPairingsArgs,
  handler: createTournamentPairingsHandler,
});
