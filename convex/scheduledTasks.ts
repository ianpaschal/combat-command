import { internalMutation } from './_generated/server';

export const cleanUpFileStorage = internalMutation(async (ctx) => {
  const allStorageItems = await ctx.db.system.query('_storage').collect();

  // Gather all storageIds in use:
  const referencedIds = new Set<string>();
  const tournaments = await ctx.db.query('tournaments').collect();
  for (const t of tournaments) {
    if (t.logoStorageId) {
      referencedIds.add(t.logoStorageId);
    }
    if (t.bannerStorageId) {
      referencedIds.add(t.bannerStorageId);
    }
  }
  const photos = await ctx.db.query('photos').collect();
  for (const p of photos) {
    if (p.storageId) {
      referencedIds.add(p.storageId);
    }
  }
  const users = await ctx.db.query('users').collect();
  for (const u of users) {
    if (u.avatarStorageId) {
      referencedIds.add(u.avatarStorageId);
    }
  }

  const deletedStorageIds = new Set();

  // Delete storage items which were created more than 1 day ago and are not referenced:
  for (const item of allStorageItems) {
    if (!referencedIds.has(item._id) && item._creationTime < Date.now() - 86400000) {
      await ctx.storage.delete(item._id);
      deletedStorageIds.add(item._id);
    }
  }

  return {
    deletedStorageIds: Array.from(deletedStorageIds),
  };
});
