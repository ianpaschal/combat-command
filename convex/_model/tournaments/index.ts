import { defineTable } from 'convex/server';

import { computedFields, editableFields } from './fields';

export const tournaments = defineTable({
  ...editableFields,
  ...computedFields,
}).index(
  'by_game_system_id', ['gameSystemId'],
);

export {
  closeTournamentRound,
  closeTournamentRoundArgs,
} from './actions/closeTournamentRound';
export {
  endTournament,
  endTournamentArgs,
} from './actions/endTournament';
export {
  openTournamentRound,
  openTournamentRoundArgs,
} from './actions/openTournamentRound';
export {
  publishTournament,
  publishTournamentArgs,
} from './actions/publishTournament';
export {
  startTournament,
  startTournamentArgs,
} from './actions/startTournament';
export {
  createTournament,
  createTournamentArgs,
  deleteTournament,
  deleteTournamentArgs,
  updateTournament,
  updateTournamentArgs,
} from './mutations';
export {
  getTournament,
  getTournamentArgs,
  getTournaments,
} from './queries';
export {
  getTournamentOpenRound,
  getTournamentOpenRoundArgs,
} from './queries/getTournamentOpenRound';
export {
  getTournamentRankings,
  getTournamentRankingsArgs,
} from './queries/getTournamentRankings';
