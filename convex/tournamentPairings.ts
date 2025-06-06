import { query } from './_generated/server';
import {
  getActiveTournamentPairingsByUser as getActiveTournamentPairingsByUserHandler,
  getActiveTournamentPairingsByUserArgs,
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

export const getActiveTournamentPairingsByUser = query({
  args: getActiveTournamentPairingsByUserArgs,
  handler: getActiveTournamentPairingsByUserHandler,
});
