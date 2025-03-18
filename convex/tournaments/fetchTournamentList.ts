import { v } from 'convex/values';

import { query } from '../_generated/server';
import { GameSystemId, gameSystemId } from '../static/gameSystems';

export const fetchTournamentList = query({
  args: {},
  handler: async (ctx) => await ctx.db.query('tournaments').collect(),
});

export const foo = query({
  args: {
    gameSystem: v.optional(gameSystemId),
    gameSystemId: v.optional(gameSystemId),
  },
  handler: async (ctx, args) => {
    const query = ctx.db.query('tournaments');

    if (args.gameSystem !== undefined) {
      query.withIndex('by_game_system', (q) => q.eq('gameSystem', args.gameSystem as GameSystemId));
    }
    if (args.gameSystemId !== undefined) {
      query.withIndex('by_game_system_id', (q) => q.eq('gameSystemId', args.gameSystemId as GameSystemId));
    }

    return await query.collect();
  },
});
