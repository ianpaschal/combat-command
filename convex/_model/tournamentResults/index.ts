import { Id } from '../../_generated/dataModel';

export type TournamentResultId = Id<'tournamentResults'>;
export type { CompetitorResult, TournamentUserResult as RegistrationResult } from './types';

// Queries
export {
  getTournamentResultsByCompetitor,
  getTournamentResultsByCompetitorArgs,
} from './queries/getTournamentResultsByCompetitor';
export {
  getTournamentResultsByGameSystem,
  getTournamentResultsByGameSystemArgs,
} from './queries/getTournamentResultsByGameSystem';
export {
  getTournamentResultsByRound,
  getTournamentResultsByRoundArgs,
} from './queries/getTournamentResultsByRound';
export {
  getTournamentResultsByUser,
  getTournamentResultsByUserArgs,
} from './queries/getTournamentResultsByUser';

// Mutations
export {
  refreshTournamentResult,
  refreshTournamentResultArgs,
} from './mutations/refreshTournamentResult';

// Triggers
// (Grouped/namespaced so they can more easily be merged in functions.ts with other models.)
export * as tournamentResultTriggers from './triggers';
