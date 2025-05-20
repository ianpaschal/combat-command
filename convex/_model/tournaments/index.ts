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
  createTournament,
  createTournamentArgs,
  deleteTournament,
  deleteTournamentArgs,
  publishTournament,
  publishTournamentArgs,
  startTournament,
  startTournamentArgs,
  updateTournament,
  updateTournamentArgs,
} from './mutations';
export {
  getTournament,
  getTournamentActiveRound,
  getTournamentActiveRoundArgs,
  getTournamentArgs,
  getTournamentList,
} from './queries';
