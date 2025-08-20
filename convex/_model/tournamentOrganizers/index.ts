import { defineTable } from 'convex/server';

import { computedFields, editableFields } from './fields';

export const tournamentOrganizersTable = defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_tournament', ['tournamentId'])
  .index('by_tournament_user', ['tournamentId', 'userId'])
  .index('by_user', ['userId']);

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
export type {
  TournamentOrganizer,
  TournamentOrganizerId,
} from './types';
