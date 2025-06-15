import { defineTable } from 'convex/server';

import { Id } from '../../_generated/dataModel';
import { computedFields, editableFields } from './fields';

export const matchResultsTable = defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_game_system_id', ['gameSystemId'])
  .index('by_tournament_id', ['tournamentId'])
  .index('by_tournament_pairing_id', ['tournamentPairingId'])
  .index('by_user_id', ['player0UserId', 'player1UserId']);

export type MatchResultId = Id<'matchResults'>;

// Helpers
export { deepenMatchResult, type DeepMatchResult } from './_helpers/deepenMatchResult';
export { getShallowMatchResult } from './_helpers/getShallowMatchResult';

// Mutations
export {
  addPhotoToMatchResult,
  addPhotoToMatchResultArgs,
} from './mutations/addPhotoToMatchResult';
export {
  createMatchResult,
  createMatchResultArgs,
} from './mutations/createMatchResult';
export {
  deleteMatchResult,
  deleteMatchResultArgs,
} from './mutations/deleteMatchResult';
export {
  updateMatchResult,
  updateMatchResultArgs,
} from './mutations/updateMatchResult';

// Queries
export {
  getMatchResult,
  getMatchResultArgs,
} from './queries/getMatchResult';
export {
  getMatchResults,
} from './queries/getMatchResults';
export {
  getMatchResultsByTournament,
  getMatchResultsByTournamentArgs,
} from './queries/getMatchResultsByTournament';
export {
  getMatchResultsByTournamentPairing,
  getMatchResultsByTournamentPairingArgs,
} from './queries/getMatchResultsByTournamentPairing';
export {
  getMatchResultsByTournamentRound,
  getMatchResultsByTournamentRoundArgs,
} from './queries/getMatchResultsByTournamentRound';
