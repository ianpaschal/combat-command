import { mutation } from '../_generated/server';
import { tournamentFields } from './fields';

export const createTournament = mutation({
  args: {
    ...tournamentFields,
  },
  handler: async (ctx, args) => await ctx.db.insert('tournaments', args),
});
