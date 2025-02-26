import { v } from 'convex/values';

import { query } from '../_generated/server';
import { getLimitedUser } from '../users/utils/getLimitedUser';

export const fetchTournamentCompetitor = query({
  args: {
    id: v.id('tournamentCompetitors'),
  },
  handler: async (ctx, { id }) => {
    const tournamentCompetitor = await ctx.db.get(id);
    if (!tournamentCompetitor) {
      return null;
    }
    const players = tournamentCompetitor.players.map(async ({ active, userId }) => {
      const user = await ctx.db.get(userId);
      return {
        active,
        user: user ? await getLimitedUser(ctx, user) : null,
      };
    });
    return {
      ...tournamentCompetitor,
      players,
    };
  },
});
