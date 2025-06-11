import { defineTable } from 'convex/server';

import { Id } from '../../_generated/dataModel';
import { computedFields, editableFields } from './fields';

export const tournamentsTable = defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_game_system_id', ['gameSystemId'])
  .index('by_status', ['status']);

export type TournamentId = Id<'tournaments'>;

// Helpers
export { checkTournamentAuth } from './_helpers/checkTournamentAuth';
export { deepenTournament, type TournamentDeep } from './_helpers/deepenTournament';
export { getTournamentDeep } from './_helpers/getTournamentDeep';
export { getTournamentShallow } from './_helpers/getTournamentShallow';
export { getTournamentUserIds } from './_helpers/getTournamentUserIds';

// Mutations
export {
  closeTournamentRound,
  closeTournamentRoundArgs,
} from './mutations/closeTournamentRound';
export {
  createTournament,
  createTournamentArgs,
} from './mutations/createTournament';
export {
  deleteTournament,
  deleteTournamentArgs,
} from './mutations/deleteTournament';
export {
  endTournament,
  endTournamentArgs,
} from './mutations/endTournament';
export {
  openTournamentRound,
  openTournamentRoundArgs,
} from './mutations/openTournamentRound';
export {
  publishTournament,
  publishTournamentArgs,
} from './mutations/publishTournament';
export {
  startTournament,
  startTournamentArgs,
} from './mutations/startTournament';
export {
  updateTournament,
  updateTournamentArgs,
} from './mutations/updateTournament';

// Queries
export {
  getTournament,
  getTournamentArgs,
} from './queries/getTournament';
export {
  getTournamentOpenRound,
  getTournamentOpenRoundArgs,
  type TournamentOpenRound,
} from './queries/getTournamentOpenRound';
export {
  getTournamentRankings,
  getTournamentRankingsArgs,
  type TournamentCompetitorRanked,
  type TournamentPlayerRanked,
  type TournamentRankings,
} from './queries/getTournamentRankings';
export {
  getTournaments,
} from './queries/getTournaments';
export {
  getTournamentsByStatus,
  getTournamentsByStatusArgs,
} from './queries/getTournamentsByStatus';
