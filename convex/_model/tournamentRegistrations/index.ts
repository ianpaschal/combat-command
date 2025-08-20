import { defineTable } from 'convex/server';

import { computedFields, editableFields } from './fields';

export const tournamentRegistrationsTable = defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_tournament', ['tournamentId'])
  .index('by_tournament_user', ['tournamentId', 'userId'])
  .index('by_tournament_competitor', ['tournamentCompetitorId'])
  .index('by_user', ['userId']);

export {
  createTournamentRegistration,
  createTournamentRegistrationArgs,
} from './mutations/create';
export {
  deleteTournamentRegistration,
  deleteTournamentRegistrationArgs,
} from './mutations/delete';
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
