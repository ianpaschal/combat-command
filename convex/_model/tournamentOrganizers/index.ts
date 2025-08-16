import { defineTable } from 'convex/server';

import { Id } from '../../_generated/dataModel';
import { computedFields, editableFields } from './fields';

export const tournamentOrganizersTable = defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_tournament', ['tournamentId'])
  .index('by_tournament_user', ['tournamentId', 'userId'])
  .index('by_user', ['userId']);

export type TournamentRegistrationId = Id<'tournamentOrganizers'>;

export {
  checkUserIsTournamentOrganizer,
} from './_helpers/checkUserIsTournamentOrganizer';
export {
  createTournamentOrganizer,
  createTournamentOrganizerArgs,
} from './mutations/create';
export {
  deleteTournamentOrganizer,
  deleteTournamentOrganizerArgs,
} from './mutations/delete';
export {
  getTournamentOrganizersByTournament,
  getTournamentOrganizersByTournamentArgs,
} from './queries/getTournamentOrganizersByTournament';
export {
  getTournamentOrganizersByUser,
  getTournamentOrganizersByUserArgs,
} from './queries/getTournamentOrganizersByUser';
