import { defineTable } from 'convex/server';

import { computedFields, editableFields } from './fields';

export const tournamentPairings = defineTable({
  ...editableFields,
  ...computedFields,
}).index(
  'by_tournament_id', ['tournamentId'],
);

export {
  getTournamentPairing,
  getTournamentPairingArgs,
  getTournamentPairingList,
} from './queries';
