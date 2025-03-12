import { v } from 'convex/values';

import { mutation } from '../_generated/server';
import { tournamentFields } from './fields';

export const updateTournament = mutation({
  args: {
    id: v.id('tournaments'),
    ...tournamentFields,
  },
  handler: async (ctx, { id, ...args }) => await ctx.db.patch(id, {
    ...args,
    modifiedAt: Date.now(),
  }),
});
