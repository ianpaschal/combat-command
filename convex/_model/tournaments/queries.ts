import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../_generated/server';
import { notNullOrUndefined } from '../_helpers/notNullOrUndefined';
import { getTournamentDeep } from './helpers';

export const getTournamentArgs = v.object({
  id: v.id('tournaments'),
});

export const getTournament = async (
  ctx: QueryCtx,
  { id }: Infer<typeof getTournamentArgs>,
) => {
  const result = await ctx.db.get(id);
  if (!result) {
    return null;
  }
  return await getTournamentDeep(ctx, result);
};

export const getTournaments = async (
  ctx: QueryCtx,
) => {
  const result = await ctx.db.query('tournaments').collect();
  const deepResults = await Promise.all(
    result.map(
      async (item) => await getTournamentDeep(ctx, item),
    ),
  );

  // TODO: Add pagination
  return deepResults.filter(notNullOrUndefined);
};
