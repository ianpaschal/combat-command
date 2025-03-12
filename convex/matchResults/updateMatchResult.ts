import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';

import { mutation } from '../_generated/server';
import { matchResultFields } from './fields';

export const updateMatchResult = mutation({
  args: {
    id: v.id('matchResults'),
    ...matchResultFields,
  },
  handler: async (ctx, { id, ...args }) => {
    
    const userId = await getAuthUserId(ctx);

    const confirmations = {
      player0Confirmed: false,
      player1Confirmed: false,
    };

    if((userId === args.player0UserId) || args.player0Placeholder) {
      confirmations.player0Confirmed = true;
    }
    if((userId === args.player1UserId) || args.player1Placeholder) {
      confirmations.player1Confirmed = true;
    }
    
    return await ctx.db.patch(id, {
      ...args,
      ...confirmations,
      modifiedAt: Date.now(),
    });
  },
});
