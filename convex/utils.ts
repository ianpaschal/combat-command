import { mutation } from './_generated/server';
import {
  createTestTournament as createTestTournamentHandler,
  createTestTournamentArgs,
  createTestTournamentMatchResults as createTestTournamentMatchResultsHandler,
  createTestTournamentMatchResultsArgs,
  deleteTestTournament as deleteTestTournamentHandler,
  deleteTestTournamentArgs,
} from './_model/utils';

export const createTestTournament = mutation({
  args: createTestTournamentArgs,
  handler: createTestTournamentHandler,
});

export const createTestTournamentMatchResults = mutation({
  args: createTestTournamentMatchResultsArgs,
  handler: createTestTournamentMatchResultsHandler,
});

export const deleteTestTournament = mutation({
  args: deleteTestTournamentArgs,
  handler: deleteTestTournamentHandler,
});
