import { Infer, v } from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { getShallowMatchResult } from '../_helpers/getShallowMatchResult';

export const addPhotoToMatchResultArgs = v.object({
  matchResultId: v.id('matchResults'),
  photoId: v.id('photos'),
});

/**
 * Attaches a photo to a match result.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.matchResultId - ID of the match result
 * @param args.photoId - ID of the photo
 */
export const addPhotoToMatchResult = async (
  ctx: MutationCtx,
  args: Infer<typeof addPhotoToMatchResultArgs>,
): Promise<void> => {
  await checkAuth(ctx);
  const matchResult = await getShallowMatchResult(ctx, args.matchResultId);
    
  // ---- PRIMARY ACTIONS ----
  return await ctx.db.patch(args.matchResultId, {
    photoIds: [
      ...(matchResult?.photoIds || []),
      args.photoId,
    ],
    modifiedAt: Date.now(),
  });
};
