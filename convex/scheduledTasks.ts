import { Id } from './_generated/dataModel';
import { internalMutation } from './_generated/server';

const DAY = 86400000; // 24 hours in ms

export const cleanUpFileStorage = internalMutation(async (ctx) => {
  const allStorageItems = await ctx.db.system.query('_storage').collect();

  // Gather all storageIds in use:
  const referencedIds = new Set<Id<'_storage'>>();
  const tournaments = await ctx.db.query('tournaments').collect();
  for (const t of tournaments) {
    if (t.logoStorageId) {
      referencedIds.add(t.logoStorageId);
    }
    if (t.bannerStorageId) {
      referencedIds.add(t.bannerStorageId);
    }
  }
  const leagues = await ctx.db.query('leagues').collect();
  for (const l of leagues) {
    if (l.logoStorageId) {
      referencedIds.add(l.logoStorageId);
    }
    if (l.bannerStorageId) {
      referencedIds.add(l.bannerStorageId);
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

  const deletedIds = new Set();

  // Delete storage items which were created more than 1 day ago and are not referenced:
  for (const item of allStorageItems) {
    if (!referencedIds.has(item._id) && item._creationTime + DAY < Date.now()) {
      await ctx.storage.delete(item._id);
      deletedIds.add(item._id);
    }
  }

  return Array.from(deletedIds);
});

export const cleanUpTournaments = internalMutation(async (ctx) => {
  const tournaments = await ctx.db.query('tournaments').collect();

  // Delete tournaments which were supposed to start more than 1 day ago and never did:
  for (const tournament of tournaments) {

    // If tournament was never started, set it to revert it to draft:
    if (tournament.status === 'published' && tournament.startsAt + DAY < Date.now()) {
      await ctx.db.patch(tournament._id, {
        status: 'draft',
      });
    }
  }
});
