import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { notNullOrUndefined } from '../../common/_helpers/notNullOrUndefined';
import { checkListVisibility } from '../_helpers/checkListVisibility';
import { deepenList, DeepList } from '../_helpers/deepenList';

export const getListsByTournamentRegistrationArgs = v.object({
  tournamentRegistrationId: v.id('tournamentRegistrations'),
});

export const getListsByTournamentRegistration = async (
  ctx: QueryCtx,
  args: Infer<typeof getListsByTournamentRegistrationArgs>,
): Promise<DeepList[]> => {
  const results = await ctx.db.query('lists')
    .withIndex('by_tournament_registration', (q) => q.eq('tournamentRegistrationId', args.tournamentRegistrationId))
    .collect();
  const deepResults = await Promise.all(results.map(async (r) => {
    if (await checkListVisibility(ctx, r)) {
      return await deepenList(ctx, r);
    }
    return null;
  }));
  return deepResults.filter(notNullOrUndefined);
};
