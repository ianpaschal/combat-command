import { Infer } from 'convex/values';

import { Id } from '../../_generated/dataModel';
import { scoreAdjustment } from '../common/scoreAdjustment';

export type TournamentCompetitorId = Id<'tournamentCompetitors'>;
export type ScoreAdjustment = Infer<typeof scoreAdjustment>;

// Helpers
export {
  deepenTournamentCompetitor,
  type DeepTournamentCompetitor,
} from './_helpers/deepenTournamentCompetitor';
export {
  TournamentCompetitorActionKey,
} from './_helpers/getAvailableActions';
export {
  getDisplayName,
} from './_helpers/getDisplayName';

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

// Triggers
// (Grouped/namespaced so they can more easily be merged in functions.ts with other models.)
export * as tournamentCompetitorTriggers from './triggers';
