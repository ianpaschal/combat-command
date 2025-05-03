import { query } from './_generated/server';
import { getTournamentRankings as getTournamentRankingsHandler, getTournamentRankingsArgs } from './_model/tournamentRankings';

export const getTournamentRankings = query({
  args: getTournamentRankingsArgs,
  handler: getTournamentRankingsHandler,
});
