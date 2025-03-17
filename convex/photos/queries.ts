import { v } from 'convex/values';

import { query } from '../_generated/server';

/**
 * @deprecated
 */
export const fetchPhotoListById = query({
  args: {
    ids: v.array(v.id('photos')),
  },
  handler: async (ctx, args) => {
    // TODO: Change once Convex supports array of ids
    const photos = await ctx.db.query('photos').collect();
    return Promise.all(photos.filter((photo) => args.ids.includes(photo._id)).map(async (photo) => {
      const url = await ctx.storage.getUrl(photo.storageId);
      return {
        ...photo,
        url,
      };
    }));
  },
});

export const fetchPhoto = query({
  args: {
    id: v.id('photos'),
  },
  handler: async (ctx, args) => {
    const photo = await ctx.db.get(args.id);
    if (!photo) {
      return null;
    }
    return {
      ...photo,
      url: await ctx.storage.getUrl(photo.storageId),
    };
  },
});
