import { v } from 'convex/values';

import { mutation } from '../_generated/server';

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
