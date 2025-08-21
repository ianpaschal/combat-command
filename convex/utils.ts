import { internalMutation, mutation } from './_generated/server';
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
