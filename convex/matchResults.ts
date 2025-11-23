import { mutation, query } from './_generated/server';
import * as model from './_model/matchResults';
import { mutationWithTrigger } from './functions';

export const getMatchResult = query({
  args: model.getMatchResultArgs,
  handler: model.getMatchResult,
});

export const getMatchResults = query({
  args: model.getMatchResultsArgs,
  handler: model.getMatchResults,
});

export const getMatchResultsByTournament = query({
  args: model.getMatchResultsByTournamentArgs,
  handler: model.getMatchResultsByTournament,
});

export const getMatchResultsByUser = query({
  args: model.getMatchResultsByUserArgs,
  handler: model.getMatchResultsByUser,
});

export const getMatchResultsByTournamentPairing = query({
  args: model.getMatchResultsByTournamentPairingArgs,
  handler: model.getMatchResultsByTournamentPairing,
});

export const getMatchResultsByTournamentRound = query({
  args: model.getMatchResultsByTournamentRoundArgs,
  handler: model.getMatchResultsByTournamentRound,
});

export const addPhotoToMatchResult = mutation({
  args: model.addPhotoToMatchResultArgs,
  handler: model.addPhotoToMatchResult,
});

export const createMatchResult = mutation({
  args: model.createMatchResultArgs,
  handler: model.createMatchResult,
});

export const updateMatchResult = mutationWithTrigger({
  args: model.updateMatchResultArgs,
  handler: model.updateMatchResult,
});

export const deleteMatchResult = mutation({
  args: model.deleteMatchResultArgs,
  handler: model.deleteMatchResult,
});

export const deleteMatchResultsByTournamentRound = mutation({
  args: model.deleteMatchResultsByTournamentRoundArgs,
  handler: model.deleteMatchResultsByTournamentRound,
});
