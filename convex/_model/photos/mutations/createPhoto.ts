import { Infer, v } from 'convex/values';

import { Id } from '../../../_generated/dataModel';
import { MutationCtx } from '../../../_generated/server';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { fields } from '../table';

export const createPhotoArgs = v.object({
  ...fields,
});

export const createPhoto = async (
  ctx: MutationCtx,
  args: Infer<typeof createPhotoArgs>,
): Promise<Id<'photos'>> => {
  // --- CHECK AUTH ----
  const userId = await checkAuth(ctx);

  // ---- PRIMARY ACTIONS ----
  return await ctx.db.insert('photos', {
    ...args,
    ownerUserId: userId,
  });
};
