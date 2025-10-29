import { Id } from '../../_generated/dataModel';

export type TournamentResultId = Id<'tournamentResults'>;
export type { CompetitorResult, RegistrationResult } from './types';

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

// Mutations
export {
  refreshTournamentResult,
  refreshTournamentResultArgs,
} from './mutations/refreshTournamentResult';
