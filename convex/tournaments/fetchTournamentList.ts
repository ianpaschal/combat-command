import { v } from 'convex/values';

import { query } from '../_generated/server';
import { GameSystem, gameSystem } from '../common/gameSystem';

export const fetchGameSystemConfigList = query({
  args: {},
  handler: async (ctx) => await ctx.db.query('tournaments').collect(),
});

export const foo = query({
  args: {
    gameSystem: v.optional(gameSystem),
  },
  handler: async (ctx, args) => {
    const query = ctx.db.query('tournaments');

    if (args.gameSystem !== undefined) {
      query.withIndex('by_game_system', (q) => q.eq('gameSystem', args.gameSystem as GameSystem));
    }

    return await query.collect();
  },
});
