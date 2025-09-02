import { Infer, v } from 'convex/values';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getStorageUrl } from '../../common/_helpers/getStorageUrl';

export const getPhotoArgs = v.object({
  id: v.id('photos'),
});

export const getPhoto = async (
  ctx: QueryCtx,
  args: Infer<typeof getPhotoArgs>,
): Promise<Doc<'photos'> & { url?: string } | null> => {
  const photo = await ctx.db.get(args.id);
  if (!photo) {
    return null;
  }
  const url = await getStorageUrl(ctx, photo.storageId);
  return {
    ...photo,
    url,
  };
};
