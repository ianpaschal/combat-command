import { v } from 'convex/values';

import { mutation } from '../_generated/server';
import { fields } from '.';

export const updateTournament = mutation({
  args: {
    id: v.id('tournaments'),
    ...fields,
  },
  handler: async (ctx, { id, ...args }) => await ctx.db.patch(id, {
    ...args,
    modifiedAt: Date.now(),
  }),
});
