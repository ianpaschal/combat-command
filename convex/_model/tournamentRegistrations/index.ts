import { defineTable } from 'convex/server';

import { Id } from '../../_generated/dataModel';
import { computedFields, editableFields } from './fields';

export const tournamentRegistrationsTable = defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_tournament', ['tournamentId'])
  .index('by_tournament_user', ['tournamentId', 'userId'])
  .index('by_tournament_competitor', ['tournamentCompetitorId'])
  .index('by_user', ['userId']);

export type TournamentRegistrationId = Id<'tournamentRegistrations'>;

export {
  type DeepTournamentRegistration,
} from './_helpers/deepenTournamentRegistration';
export {
  createTournamentRegistration,
  createTournamentRegistrationArgs,
} from './mutations/create';
export {
  deleteTournamentRegistration,
  deleteTournamentRegistrationArgs,
} from './mutations/delete';
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
