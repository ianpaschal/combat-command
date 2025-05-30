import { defineTable } from 'convex/server';

import { fields } from './fields';

export const tournamentTimers = defineTable({
  ...fields,
}).index(
  'by_tournament_id', ['tournamentId'],
);

export {
  pauseTournamentTimer,
  pauseTournamentTimerArgs,
  resetTournamentTimer,
  resetTournamentTimerArgs,
  startTournamentTimer,
  startTournamentTimerArgs,
} from './mutations';
export {
  getTournamentTimer,
  getTournamentTimerArgs,
} from './queries/getTournamentTimer';
