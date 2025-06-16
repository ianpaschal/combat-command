import { defineTable } from 'convex/server';

import { Id } from '../../_generated/dataModel';
import {
  computedFields,
  createOnlyFields,
  editableFields,
} from './fields';

export const tournamentCompetitorsTable = defineTable({
  ...editableFields,
  ...createOnlyFields,
  ...computedFields,
})
  .index('by_tournament_id', ['tournamentId']);

export type TournamentCompetitorId = Id<'tournamentCompetitors'>;

// Helpers
export {
  deepenTournamentCompetitor,
  type DeepTournamentCompetitor,
} from './_helpers/deepenTournamentCompetitor';

// Mutations
export {
  addTournamentCompetitorPlayer,
  addTournamentCompetitorPlayerArgs,
} from './mutations/addTournamentCompetitorPlayer';
export {
  createTournamentCompetitor,
  createTournamentCompetitorArgs,
} from './mutations/createTournamentCompetitor';
export {
  removeTournamentCompetitorPlayer,
  removeTournamentCompetitorPlayerArgs,
} from './mutations/removeTournamentCompetitorPlayer';
export {
  toggleTournamentCompetitorActive,
  toggleTournamentCompetitorActiveArgs,
} from './mutations/toggleTournamentCompetitorActive';
export {
  updateTournamentCompetitor,
  updateTournamentCompetitorArgs,
} from './mutations/updateTournamentCompetitor';

// Queries
export {
  getTournamentCompetitor,
  getTournamentCompetitorArgs,
} from './queries/getTournamentCompetitor';
export {
  getTournamentCompetitors,
} from './queries/getTournamentCompetitors';
export {
  getTournamentCompetitorsByTournament,
  getTournamentCompetitorsByTournamentArgs,
} from './queries/getTournamentCompetitorsByTournament';
