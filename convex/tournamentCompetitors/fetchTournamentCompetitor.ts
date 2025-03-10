import { v } from 'convex/values';

import { query } from '../_generated/server';
import { redactUserInfo } from '../users/utils/redactUserInfo';

export const fetchTournamentCompetitor = query({
  args: {
    id: v.id('tournamentCompetitors'),
  },
  handler: async (ctx, { id }) => {
    const tournamentCompetitor = await ctx.db.get(id);
    if (!tournamentCompetitor) {
      return null;
    }
    const players = await Promise.all(tournamentCompetitor.players.map(async ({ active, userId }) => {
      const user = await ctx.db.get(userId);
      return {
        active,
        user: user ? await redactUserInfo(ctx, user) : null,
      };
    }));
    return {
      ...tournamentCompetitor,
      players,
    };
  },
});
