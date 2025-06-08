import { defineTable } from 'convex/server';

import { computedFields, editableFields } from './fields';

export const tournamentCompetitors = defineTable({
  ...editableFields,
  ...computedFields,
}).index(
  'by_tournament_id', ['tournamentId'],
);

export {
  addPlayerToTournamentCompetitor,
  addPlayerToTournamentCompetitorArgs,
  createTournamentCompetitor,
  createTournamentCompetitorArgs,
  removePlayerFromTournamentCompetitor,
  removePlayerFromTournamentCompetitorArgs,
  substituteTournamentCompetitorPlayer,
  substituteTournamentCompetitorPlayerArgs,
  toggleTournamentCompetitorActive,
  toggleTournamentCompetitorActiveArgs,
  updateTournamentCompetitor,
  updateTournamentCompetitorArgs,
} from './mutations';
export {
  getTournamentCompetitor,
  getTournamentCompetitorArgs,
  getTournamentCompetitorList,
  getTournamentCompetitorListByTournamentId,
  getTournamentCompetitorListByTournamentIdArgs,
} from './queries';
