import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { tournamentStatus } from '../../../common/tournamentStatus';
import { notNullOrUndefined } from '../../_helpers/notNullOrUndefined';
import { getTournamentDeep, TournamentDeep } from '../helpers';

export const getTournamentsByStatusArgs = v.object({
  status: tournamentStatus,
});

export const getTournamentsByStatus = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentsByStatusArgs>,
): Promise<TournamentDeep[]> => {
  const result = await ctx.db.query('tournaments').withIndex('by_status', ((q) => q.eq('status', args.status))).collect();
  const deepResults = await Promise.all(
    result.map(
      async (item) => await getTournamentDeep(ctx, item),
    ),
  );
  return deepResults.filter(notNullOrUndefined);
};
