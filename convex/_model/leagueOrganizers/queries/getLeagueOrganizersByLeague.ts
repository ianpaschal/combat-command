import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenLeagueOrganizer } from '../_helpers/deepenLeagueOrganizer';
import { LeagueOrganizer } from '../types';

export const getLeagueOrganizersByLeagueArgs = v.object({
  leagueId: v.id('leagues'),
});

export const getLeagueOrganizersByLeague = async (
  ctx: QueryCtx,
  args: Infer<typeof getLeagueOrganizersByLeagueArgs>,
): Promise<LeagueOrganizer[]> => {
  const records = await ctx.db.query('leagueOrganizers')
    .withIndex('by_league', (q) => q.eq('leagueId', args.leagueId))
    .collect();
  return Promise.all(records.map((item) => deepenLeagueOrganizer(ctx, item)));
};
