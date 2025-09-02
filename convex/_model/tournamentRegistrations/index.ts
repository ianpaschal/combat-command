export {
  createTournamentRegistration,
  createTournamentRegistrationArgs,
} from './mutations/createTournamentRegistration';
export {
  deleteTournamentRegistration,
  deleteTournamentRegistrationArgs,
} from './mutations/deleteTournamentRegistration';
export {
  toggleTournamentRegistrationActive,
  toggleTournamentRegistrationActiveArgs,
} from './mutations/toggleActive';
export {
  getTournamentRegistrationsByCompetitor,
  getTournamentRegistrationsByCompetitorArgs,
} from './queries/getTournamentRegistrationsByCompetitor';
export {
  getTournamentRegistrationsByTournament,
  getTournamentRegistrationsByTournamentArgs,
} from './queries/getTournamentRegistrationsByTournament';
export {
  getTournamentRegistrationsByUser,
  getTournamentRegistrationsByUserArgs,
} from './queries/getTournamentRegistrationsByUser';
export type {
  TournamentRegistration,
  TournamentRegistrationId,
} from './types';
