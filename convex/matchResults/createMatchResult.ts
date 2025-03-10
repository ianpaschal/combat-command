import { getAuthUserId } from '@convex-dev/auth/server';

import { mutation } from '../_generated/server';
import { matchResultFields } from './fields';

export const createMatchResult = mutation({
  args: {
    ...matchResultFields,
  },
  handler: async (ctx, args) => {

    if (await getAuthUserId(ctx) !== args.player0UserId) {
      throw 'Cannot add match as another user.';
    }

    if (!args.player1UserId && !args.player1Placeholder) {
      throw 'Match result must include reference to another user or a placeholder.';
    }

    // TODO: Validate: Check that details match game system config

    return await ctx.db.insert('matchResults', {
      ...args,
      player0Confirmed: true,
      player1Confirmed: !!args.player1Placeholder,
      likes: [],
    });
  },
});
