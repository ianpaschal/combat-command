import { v } from 'convex/values';

import { query } from '../_generated/server';

export const fetchTournament = query({
  args: {
    id: v.id('tournaments'),
  },
  // TODO: Join competitors and such?
  handler: async (ctx, args) => await ctx.db.get(args.id),
});
