import { v } from 'convex/values';

import { Id } from '../_generated/dataModel';
import { query } from '../_generated/server';

export const fetchTournamentUserIds = query({
  args: {
    id: v.id('tournaments'),
  },
  handler: async (ctx, { id }) => {
    const competitors = await ctx.db.query('tournamentCompetitors').withIndex('by_tournament_id', (q) => q.eq('tournamentId', id)).collect();
    return new Set(competitors.reduce((acc, c) => [
      ...acc,
      ...c.players.map((p) => p.userId),
    ], [] as Id<'users'>[]));
  },
});
