import { defineTable } from 'convex/server';

import { computedFields, editableFields } from './fields';

export const tournamentPairings = defineTable({
  ...editableFields,
  ...computedFields,
}).index(
  'by_tournament_id', ['tournamentId'],
);

export {
  type TournamentPairingDeep,
} from './helpers';
export {
  getDraftTournamentPairings,
  getDraftTournamentPairingsArgs,
  getTournamentPairing,
  getTournamentPairingArgs,
  getTournamentPairings,
  getTournamentPairingsArgs,
} from './queries';
export {
  getActiveTournamentPairingsByUser,
  getActiveTournamentPairingsByUserArgs,
} from './queries/getActiveTournamentPairingsByUser';
