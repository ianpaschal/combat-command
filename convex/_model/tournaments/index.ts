import { defineTable } from 'convex/server';

import { computedFields, editableFields } from './fields';

export const tournaments = defineTable({
  ...editableFields,
  ...computedFields,
}).index(
  'by_game_system_id', ['gameSystemId'],
);

export {
  checkInPlayer,
  checkInPlayerArgs,
} from './actions/checkInPlayer';
export {
  startTournament,
  startTournamentArgs,
} from './actions/startTournament';
export {
  createTournament,
  createTournamentArgs,
  deleteTournament,
  deleteTournamentArgs,
  publishTournament,
  publishTournamentArgs,
  updateTournament,
  updateTournamentArgs,
} from './mutations';
export {
  getTournament,
  getTournamentArgs,
  getTournamentList,
} from './queries';
