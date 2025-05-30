import { defineTable } from 'convex/server';

import { computedFields, editableFields } from './fields';

export const tournamentPairings = defineTable({
  ...editableFields,
  ...computedFields,
}).index(
  'by_tournament_id', ['tournamentId'],
);

export {
  commitTournamentPairings,
  commitTournamentPairingsArgs,
} from './mutations/commitTournamentPairings';
export {
  getDraftTournamentPairings,
  getDraftTournamentPairingsArgs,
  getTournamentPairing,
  getTournamentPairingArgs,
  getTournamentPairings,
  getTournamentPairingsArgs,
} from './queries';
