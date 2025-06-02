import { query } from './_generated/server';
import {
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
