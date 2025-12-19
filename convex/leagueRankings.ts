import { query } from './_generated/server';
import * as model from './_model/leagueRankings';

export const getLeagueRankingFullResults = query({
  args: model.getLeagueRankingFullResultsArgs,
  handler: model.getLeagueRankingFullResults,
});

export const getLeagueRankingsByLeague = query({
  args: model.getLeagueRankingsByLeagueArgs,
  handler: model.getLeagueRankingsByLeague,
});
