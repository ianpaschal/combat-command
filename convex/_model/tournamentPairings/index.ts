import { defineTable } from 'convex/server';

import { computedFields, editableFields } from './fields';

export const tournamentPairingsTable = defineTable({
  ...editableFields,
  ...computedFields,
}).index(
  'by_tournament_id', ['tournamentId'],
);

// Types
export type {
  DraftTournamentPairing,
  DraftTournamentPairings,
  RankedTournamentCompetitor,
} from './types';

// Helpers
export { checkDraftPairingIsValid } from './_helpers/checkDraftPairingIsValid';
export { checkOpponentIsValid } from './_helpers/checkOpponentIsValid';
export {
  deepenTournamentPairing,
  type TournamentPairingDeep,
} from './_helpers/deepenTournamentPairing';
export { generateDraftAdjacentPairings } from './_helpers/generateDraftAdjacentPairings';
export { generateDraftRandomPairings } from './_helpers/generateDraftRandomPairings';
export {
  generateTableAssignments,
  type UnassignedTournamentPairing,
  unassignedTournamentPairingFields,
} from './_helpers/generateTableAssignments';
export { getTournamentPairingDeep } from './_helpers/getTournamentPairingDeep';
export { getTournamentPairingShallow } from './_helpers/getTournamentPairingShallow';

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
