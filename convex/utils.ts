import {
  internalAction,
  internalMutation,
  mutation,
} from './_generated/server';
import * as model from './_model/utils';

export const createTestTournament = mutation({
  args: model.createTestTournamentArgs,
  handler: model.createTestTournament,
});

export const createTestTournamentMatchResults = mutation({
  args: model.createTestTournamentMatchResultsArgs,
  handler: model.createTestTournamentMatchResults,
});

export const deleteTestTournament = mutation({
  args: model.deleteTestTournamentArgs,
  handler: model.deleteTestTournament,
});

export const mergeUser = mutation({
  args: model.mergeUserArgs,
  handler: model.mergeUser,
});

export const createTestUsers = internalMutation({
  handler: model.createTestUsers,
});

export const revealTournamentPlayerNames = internalMutation({
  args: model.revealTournamentPlayerNamesArgs,
  handler: model.revealTournamentPlayerNames,
});

export const populateUsers = internalAction({
  handler: model.populateUsers,
});

export const refreshSearchIndex = internalMutation({
  args: model.refreshSearchIndexArgs,
  handler: model.refreshSearchIndex,
});
