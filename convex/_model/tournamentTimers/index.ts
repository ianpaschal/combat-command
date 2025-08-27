import { Id } from '../../_generated/dataModel';

export type TournamentTimerId = Id<'tournamentTimers'>;
export {
  convertRoundStructureToMs,
  type TournamentRoundStructure,
} from './_helpers/convertRoundStructureToMs';
export {
  type TournamentTimerDeep,
} from './_helpers/deepenTournamentTimer';
export {
  createTournamentTimer,
  createTournamentTimerArgs,
} from './mutations/createTournamentTimer';
export {
  deleteTournamentTimerByTournament,
  deleteTournamentTimerByTournamentArgs,
} from './mutations/deleteTournamentTimerByTournament';
export {
  setTournamentTimerPhase,
  setTournamentTimerPhaseArgs,
} from './mutations/setTournamentTimerPhase';
export {
  toggleTournamentTimer,
  toggleTournamentTimerArgs,
} from './mutations/toggleTournamentTimer';
export {
  getTournamentTimer,
  getTournamentTimerArgs,
} from './queries/getTournamentTimer';
export {
  getTournamentTimerByTournament,
  getTournamentTimerByTournamentArgs,
} from './queries/getTournamentTimerByTournament';
