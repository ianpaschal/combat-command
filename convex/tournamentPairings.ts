import { query } from './_generated/server';
import * as model from './_model/tournamentPairings';

export const getTournamentPairing = query({
  args: model.getTournamentPairingArgs,
  handler: model.getTournamentPairing,
});

export const getTournamentPairings = query({
  args: model.getTournamentPairingsArgs,
  handler: model.getTournamentPairings,
});

export const getDraftTournamentPairings = query({
  args: model.getDraftTournamentPairingsArgs,
  handler: model.getDraftTournamentPairings,
});

export const getActiveTournamentPairingsByUser = query({
  args: model.getActiveTournamentPairingsByUserArgs,
  handler: model.getActiveTournamentPairingsByUser,
});
