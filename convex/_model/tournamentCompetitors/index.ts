import { Id } from '../../_generated/dataModel';

export type TournamentCompetitorId = Id<'tournamentCompetitors'>;

// Helpers
export {
  deepenTournamentCompetitor,
  type DeepTournamentCompetitor,
} from './_helpers/deepenTournamentCompetitor';
export {
  TournamentCompetitorActionKey,
} from './_helpers/getAvailableActions';

// Mutations
export {
  createTournamentCompetitor,
  createTournamentCompetitorArgs,
} from './mutations/createTournamentCompetitor';
export {
  deleteTournamentCompetitor,
  deleteTournamentCompetitorArgs,
} from './mutations/deleteTournamentCompetitor';
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
