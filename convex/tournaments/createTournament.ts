import { mutation } from '../_generated/server';
import { fields } from '.';

export const createTournament = mutation({
  args: {
    ...fields,
  },
  handler: async (ctx, args) => await ctx.db.insert('tournaments', args),
});
