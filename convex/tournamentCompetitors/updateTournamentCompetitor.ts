import { v } from 'convex/values';

import { mutation } from '../_generated/server';
import { tournamentCompetitorFields } from '.';

export const updateTournamentCompetitor = mutation({
  args: {
    ...tournamentCompetitorFields,
    tournamentId: v.id('tournaments'),
    id: v.id('tournamentCompetitors'),
  },
  handler: async (ctx, { id, tournamentId, ...args }) => {
    const tournament = await ctx.db.get(tournamentId);
    if (tournament) {

      // Validate
      if (tournament.status === 'archived') {
        throw 'It is not possible to modify an archived tournament.';
      }

      await ctx.db.patch(id, {
        ...args,
        modifiedAt: Date.now(),
      });
    }
  },
});
