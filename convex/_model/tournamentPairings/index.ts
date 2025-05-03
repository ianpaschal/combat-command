import { defineTable } from 'convex/server';

import { computedFields, editableFields } from './fields';

export const tournamentPairings = defineTable({
  ...editableFields,
  ...computedFields,
}).index(
  'by_tournament_id', ['tournamentId'],
);

export {
  createTournamentPairings,
  createTournamentPairingsArgs,
} from './mutations/createTournamentPairings';
export {
  getTournamentPairing,
  getTournamentPairingArgs,
  getTournamentPairingList,
  getTournamentPairingListArgs,
} from './queries';
