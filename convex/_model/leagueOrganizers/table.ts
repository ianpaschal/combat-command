import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const editableFields = {
  userId: v.id('users'),
  leagueId: v.id('leagues'),
};

/**
 * Fields which can only be edited using special mutations, or which are set programmatically.
 */
export const computedFields = {
  modifiedAt: v.optional(v.number()),
};

export default defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_league', ['leagueId'])
  .index('by_league_user', ['leagueId', 'userId'])
  .index('by_user', ['userId']);
