import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';

import { mutation } from '../_generated/server';
import { fields } from '.';

export const addPhotoToMatchResult = mutation({
  args: {
    matchResultId: v.id('matchResults'),
    photoId: v.id('photos'),
  },
  handler: async (ctx, args) => {

    // TODO: Add check that user is in the match result

    const matchResult = await ctx.db.get(args.matchResultId);
    if (!matchResult) {
      throw 'Match result not found'; 
    } 
    
    return await ctx.db.patch(args.matchResultId, {
      photoIds: [
        ...(matchResult?.photoIds || []),
        args.photoId,
      ],
      modifiedAt: Date.now(),
    });
  },
});

// TODO: Allow user to remove their opponent if the opponent confirms
export const removeUserFromMatchResult = mutation({
  args: {
    matchResultId: v.id('matchResults'),
    userId: v.id('users'),
    placeholder: v.optional(v.string()),
  },
  handler: async (ctx, args) => { 
    const userId = await getAuthUserId(ctx);
    if (userId !== args.userId) {
      throw 'Cannot remove other users from match results.';
    }
    const matchResult = await ctx.db.get(args.matchResultId);
    if (!matchResult) {
      throw 'Match result not found.'; 
    }
    if (matchResult.tournamentPairingId) {
      throw 'Cannot modify match result belonging to a tournament.'; 
    }
    if (!(matchResult.player0UserId && matchResult.player1UserId)) {
      throw 'Cannot remove user from match result without a second user.';
    }
    if (userId === matchResult.player0UserId) {
      return await ctx.db.patch(args.matchResultId, {
        player0UserId: undefined,
        player0Confirmed: true,
        player0Placeholder: 'Unknown Player',
        modifiedAt: Date.now(),
      });
    }
    if (userId === matchResult.player1UserId) {
      return await ctx.db.patch(args.matchResultId, {
        player1UserId: undefined,
        player1Confirmed: true,
        player1Placeholder: 'Unknown Player',
        modifiedAt: Date.now(),
      });
    }
  },
});

export const createMatchResult = mutation({
  args: {
    ...fields,
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
    });
  },
});

export const updateMatchResult = mutation({
  args: {
    id: v.id('matchResults'),
    ...fields,
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

export const deleteMatchResult = mutation({
  args: {
    id: v.id('matchResults'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const matchResult = await ctx.db.get(args.id);
    if (!matchResult) {
      throw 'Match result not found.'; 
    }
    if (matchResult.tournamentPairingId) {
      throw 'Cannot delete match result belonging to a tournament.'; 
    }
    if (!userId || ![matchResult.player0UserId, matchResult.player1UserId].includes(userId)) {
      throw 'Cannot delete match result belonging to other users.';
    }
    return await ctx.db.delete(args.id);
  },
});
