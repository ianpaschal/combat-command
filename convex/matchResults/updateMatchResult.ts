import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';

import { mutation } from '../_generated/server';
import { fields } from '.';

export const updateMatchResult = mutation({
  args: {
    _id: v.id('matchResults'),
    ...fields,
  },
  handler: async (ctx, { _id, ...args }) => {
    
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
    
    return await ctx.db.patch(_id, {
      ...args,
      ...confirmations,
      modifiedAt: Date.now(),
    });
  },
});
