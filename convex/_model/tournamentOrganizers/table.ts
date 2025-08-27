import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const editableFields = {
  userId: v.id('users'),
  tournamentId: v.id('tournaments'),
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
  .index('by_tournament', ['tournamentId'])
  .index('by_tournament_user', ['tournamentId', 'userId'])
  .index('by_user', ['userId']);
