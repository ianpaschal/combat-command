import {
  action,
  mutation,
  query,
} from './_generated/server';
import * as model from './_model/tournaments';
import { mutationWithTrigger } from './functions';

export const getTournament = query({
  args: model.getTournamentArgs,
  handler: model.getTournament,
});

export const getTournamentByTournamentPairing = query({
  args: model.getTournamentByTournamentPairingArgs,
  handler: model.getTournamentByTournamentPairing,
});

export const getTournaments = query({
  handler: model.getTournaments,
});

export const getTournamentOpenRound = query({
  args: model.getTournamentOpenRoundArgs,
  handler: model.getTournamentOpenRound,
});

export const createTournament = mutation({
  args: model.createTournamentArgs,
  handler: model.createTournament,
});

export const updateTournament = mutationWithTrigger({
  args: model.updateTournamentArgs,
  handler: model.updateTournament,
});

export const deleteTournament = mutation({
  args: model.deleteTournamentArgs,
  handler: model.deleteTournament,
});

export const endTournamentRound = mutation({
  args: model.endTournamentRoundArgs,
  handler: model.endTournamentRound,
});

export const endTournament = mutation({
  args: model.endTournamentArgs,
  handler: model.endTournament,
});

export const startTournamentRound = mutation({
  args: model.startTournamentRoundArgs,
  handler: model.startTournamentRound,
});

export const publishTournament = mutation({
  args: model.publishTournamentArgs,
  handler: model.publishTournament,
});

export const startTournament = mutation({
  args: model.startTournamentArgs,
  handler: model.startTournament,
});

export const exportFowV4TournamentMatchData = action({
  args: model.exportFowV4TournamentMatchDataArgs,
  handler: model.exportFowV4TournamentMatchData,
});
