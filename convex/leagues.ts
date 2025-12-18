import { mutation, query } from './_generated/server';
import * as model from './_model/leagues';

export const getLeague = query({
  args: model.getLeagueArgs,
  handler: model.getLeague,
});

export const getLeagues = query({
  args: {},
  handler: model.getLeagues,
});

export const refreshLeagueRankings = mutation({
  args: model.refreshLeagueRankingsArgs,
  handler: model.refreshLeagueRankings,
});
