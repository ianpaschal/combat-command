import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { QueryCtx } from '../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { notNullOrUndefined } from '../_helpers/notNullOrUndefined';
import { getDeepTournamentCompetitor } from './helpers';

export const getTournamentCompetitorArgs = v.object({
  id: v.id('tournamentCompetitors'),
});

export const getTournamentCompetitor = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentCompetitorArgs>,
) => {
  const result = await ctx.db.get(args.id);
  if (!result) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_COMPETITOR_NOT_FOUND'));
  }
  return await getDeepTournamentCompetitor(ctx, result);
};

export const getTournamentCompetitorList = async (
  ctx: QueryCtx,
) => {
  const result = await ctx.db.query('tournamentCompetitors').collect();
  const deepResults = await Promise.all(
    result.map(
      async (item) => await getDeepTournamentCompetitor(ctx, item),
    ),
  );

  // TODO: Add pagination
  return deepResults.filter(notNullOrUndefined);
};

export const getTournamentCompetitorListByTournamentIdArgs = v.object({
  tournamentId: v.id('tournaments'),
});

export const getTournamentCompetitorListByTournamentId = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentCompetitorListByTournamentIdArgs>,
) => {
  const result = await ctx.db.query('tournamentCompetitors').withIndex(
    'by_tournament_id', (q) => q.eq('tournamentId', args.tournamentId),
  ).collect();
  const deepResults = await Promise.all(
    result.map(
      async (item) => await getDeepTournamentCompetitor(ctx, item),
    ),
  );

  // TODO: Add pagination
  return deepResults.filter(notNullOrUndefined);
};
