import { Infer, v } from 'convex/values';

import { getTournamentsArgs } from './queries/getTournaments';
import { Id } from '../../_generated/dataModel';
import { editableFields } from './table';

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

const tournamentEditableFields = v.object(editableFields);
export type TournamentEditableFields = Infer<typeof tournamentEditableFields>;
export type TournamentFilterParams = Infer<typeof getTournamentsArgs>;

// Helpers
export { checkTournamentAuth } from './_helpers/checkTournamentAuth';
export { deepenTournament, type TournamentDeep } from './_helpers/deepenTournament';
export { getTournamentDeep } from './_helpers/getTournamentDeep';
export { getTournamentShallow } from './_helpers/getTournamentShallow';

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
  getTournamentByTournamentPairing,
  getTournamentByTournamentPairingArgs,
} from './queries/getTournamentByTournamentPairing';
export {
  getTournamentOpenRound,
  getTournamentOpenRoundArgs,
  type TournamentOpenRound,
} from './queries/getTournamentOpenRound';
export {
  getTournaments,
} from './queries/getTournaments';

// Actions
export {
  exportFowV4TournamentMatchData,
  exportFowV4TournamentMatchDataArgs,
} from './actions/exportFowV4TournamentMatchData';
