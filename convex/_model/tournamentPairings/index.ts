import { Doc, Id } from '../../_generated/dataModel';

export type TournamentPairingId = Id<'tournamentPairings'>;
export type ShallowTournamentPairing = Doc<'tournamentPairings'>;

// Helpers
export {
  deepenTournamentPairing,
  type TournamentPairingDeep,
} from './_helpers/deepenTournamentPairing';
export { generateDraftPairings } from './_helpers/generateDraftPairings';
export { getTournamentPairingDeep } from './_helpers/getTournamentPairingDeep';
export { getTournamentPairingShallow } from './_helpers/getTournamentPairingShallow';
export { shuffle } from './_helpers/shuffle';
export { sortByRank } from './_helpers/sortByRank';
export {
  validateTournamentPairing,
} from './_helpers/validateTournamentPairing';
export type {
  TournamentPairingStatus,
} from './types';

// Actions
export {
  generateDraftTournamentPairings,
  generateDraftTournamentPairingsArgs,
} from './actions/generateDraftTournamentPairings';
export {
  generateTableAssignments,
  generateTableAssignmentsArgs,
} from './actions/generateTableAssignments';

// Queries
export {
  getActiveTournamentPairingsByUser,
  getActiveTournamentPairingsByUserArgs,
} from './queries/getActiveTournamentPairingsByUser';
export {
  type DraftTournamentPairing,
  getDraftTournamentPairings,
  getDraftTournamentPairingsArgs,
} from './queries/getDraftTournamentPairings';
export {
  getTournamentPairing,
  getTournamentPairingArgs,
} from './queries/getTournamentPairing';
export {
  getTournamentPairings,
  getTournamentPairingsArgs,
} from './queries/getTournamentPairings';
export {
  getTournamentPairingsByTournament,
  getTournamentPairingsByTournamentArgs,
} from './queries/getTournamentPairingsByTournament';

// Mutations
export {
  createTournamentPairings,
  createTournamentPairingsArgs,
} from './mutations/createTournamentPairings';
export {
  deleteTournamentPairings,
  deleteTournamentPairingsArgs,
} from './mutations/deleteTournamentPairings';
