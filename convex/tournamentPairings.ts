import { query } from './_generated/server';
import {
  getTournamentPairing as getTournamentPairingHandler,
  getTournamentPairingArgs,
  getTournamentPairingList as getTournamentPairingListHandler,
} from './_model/tournamentPairings';

export const getTournamentPairing = query({
  args: getTournamentPairingArgs,
  handler: getTournamentPairingHandler,
});

export const getTournamentPairingList = query({
  args: {},
  handler: getTournamentPairingListHandler,
});
