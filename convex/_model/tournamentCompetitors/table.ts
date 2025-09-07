import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const editableFields = {
  tournamentId: v.id('tournaments'),
  teamName: v.optional(v.string()),
  captainUserId: v.optional(v.id('users')),
};

/**
 * Fields which can only be edited using special mutations, or which are set programmatically.
 */
export const computedFields = {
  active: v.optional(v.boolean()),
  modifiedAt: v.optional(v.number()),
};

export default defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_tournament_id', ['tournamentId']);
