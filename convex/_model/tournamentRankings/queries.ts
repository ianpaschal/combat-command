import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { aggregateResults } from './helpers/aggregateResults';
import { compareResults } from './helpers/compareResults';
import { extendResults } from './helpers/extendResults';
import { Id } from '../../_generated/dataModel';
import { QueryCtx } from '../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { getTournament } from '../tournaments/queries';
import { ExtendedResultData } from './types';

export const getTournamentRankingsArgs = v.object({
  tournamentId: v.id('tournaments'),
  round: v.number(),
  includePlayers: v.optional(v.boolean()),
});

export const getTournamentRankings = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentRankingsArgs>,
) => {
  const tournament = await getTournament(ctx, { id: args.tournamentId });
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }
  const { rankingFactors, competitorSize } = tournament;

  // 1. Gather raw results from match data
  const rawResults = await aggregateResults(ctx, args.tournamentId, args.round, args.includePlayers);

  // console.log(`Round ${args.round} raw results:`, rawResults);

  // 2. Convert raw results into total, average, and average opponent values
  const extendedResults = {
    competitors: extendResults(rawResults.competitors, competitorSize),
    players: args.includePlayers && rawResults.players ? extendResults(rawResults.players, competitorSize) : undefined,
  };

  // 3. Convert results to arrays and sort by ranking factors
  const competitorResultArray: ({ id: Id<'tournamentCompetitors'> } & ExtendedResultData<Id<'tournamentCompetitors'>>)[] = [];
  Object.entries(extendedResults.competitors).forEach(([id, results]) => {
    competitorResultArray.push({
      id: id as Id<'tournamentCompetitors'>,
      ...results,
    });
  });
  const playerResultArray: ({ id: Id<'users'> } & ExtendedResultData<Id<'users'>>)[] = [];
  if (args.includePlayers && extendedResults.players) {
    Object.entries(extendedResults.players).forEach(([id, results]) => {
      playerResultArray.push({
        id: id as Id<'users'>,
        ...results,
      });
    });
  }

  return {
    competitors: competitorResultArray.sort((a, b) => compareResults(a, b, rankingFactors)),
    players: playerResultArray.length ? playerResultArray.sort((a, b) => compareResults(a, b, rankingFactors)) : undefined,
  };
};
