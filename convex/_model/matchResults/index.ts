import { Id } from '../../_generated/dataModel';

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
  type CreateMatchResultArgs,
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
  getMatchResultsArgs,
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
export {
  getMatchResultsByUser,
  getMatchResultsByUserArgs,
} from './queries/getMatchResultsByUser';
