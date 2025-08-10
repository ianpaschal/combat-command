import { defineTable } from 'convex/server';

import { Id } from '../../_generated/dataModel';
import { computedFields, editableFields } from './fields';

export const tournamentsTable = defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_game_system_id', ['gameSystemId'])
  .index('by_starts_at', ['startsAt'])
  .index('by_status_starts_at', ['status', 'startsAt'])
  .index('by_status', ['status']);

export type TournamentId = Id<'tournaments'>;
export enum TournamentActionKey {
  Edit = 'edit',
  Delete = 'delete',
  Publish = 'publish',
  Cancel = 'cancel',
  Start = 'start',
  ConfigureRound = 'configureRound',
  StartRound = 'startRound',
  EndRound = 'endRound',
  End = 'end',
  SubmitMatchResult = 'submitMatchResult',
}

// Helpers
export { checkTournamentAuth } from './_helpers/checkTournamentAuth';
export { deepenTournament, type TournamentDeep } from './_helpers/deepenTournament';
export { getTournamentDeep } from './_helpers/getTournamentDeep';
export { getTournamentShallow } from './_helpers/getTournamentShallow';
export { getTournamentUserIds } from './_helpers/getTournamentUserIds';

// Mutations
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
  endTournamentRound,
  endTournamentRoundArgs,
} from './mutations/endTournamentRound';
export {
  publishTournament,
  publishTournamentArgs,
} from './mutations/publishTournament';
export {
  startTournament,
  startTournamentArgs,
} from './mutations/startTournament';
export {
  startTournamentRound,
  startTournamentRoundArgs,
} from './mutations/startTournamentRound';
export {
  updateTournament,
  updateTournamentArgs,
} from './mutations/updateTournament';

// Queries
export {
  getAvailableTournamentActions,
  getAvailableTournamentActionsArgs,
} from './queries/getAvailableTournamentActions';
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
  getTournamentsArgs,
} from './queries/getTournaments';
export {
  getTournamentsByStatus,
  getTournamentsByStatusArgs,
} from './queries/getTournamentsByStatus';
export {
  getTournamentsByUser,
  getTournamentsByUserArgs,
} from './queries/getTournamentsByUser';
