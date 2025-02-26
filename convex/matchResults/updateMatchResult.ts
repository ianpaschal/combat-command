import { v } from 'convex/values';

import { mutation } from '../_generated/server';
import { matchResultFields } from './fields';

export const updateMatchResult = mutation({
  args: {
    id: v.id('matchResults'),
    ...matchResultFields,
  },
  handler: async (ctx, { id, ...args }) => await ctx.db.patch(id, {
    ...args,
    modifiedAt: Date.now(),
    confirmedAt: undefined,
  }),
});
