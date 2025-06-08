import { defineTable } from 'convex/server';

import { computedFields, editableFields } from './fields';

export const tournamentPairingsTable = defineTable({
  ...editableFields,
  ...computedFields,
}).index(
  'by_tournament_id', ['tournamentId'],
);

// Helpers
export {
  deepenTournamentPairing,
  type TournamentPairingDeep,
} from './_helpers/deepenTournamentPairing';
export {
  type DraftTournamentPairing,
  generateDraftPairings,
} from './_helpers/generateDraftPairings';
export {
  generateTableAssignments,
  type UnassignedTournamentPairing,
  unassignedTournamentPairingFields,
} from './_helpers/generateTableAssignments';
export { getTournamentPairingDeep } from './_helpers/getTournamentPairingDeep';
export { getTournamentPairingShallow } from './_helpers/getTournamentPairingShallow';
export { shuffle } from './_helpers/shuffle';
export { sortByRank } from './_helpers/sortByRank';

// Queries
export {
  getActiveTournamentPairingsByUser,
  getActiveTournamentPairingsByUserArgs,
} from './queries/getActiveTournamentPairingsByUser';
export {
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
