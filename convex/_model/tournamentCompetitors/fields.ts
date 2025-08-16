import { v } from 'convex/values';

export const editableFields = {
  tournamentId: v.id('tournaments'),
  teamName: v.optional(v.string()),
  players: v.optional(v.array(v.object({
    userId: v.id('users'),
    active: v.boolean(),
    listId: v.optional(v.id('lists')),
  }))),
  captainUserId: v.optional(v.id('users')),
};

/**
 * Fields which can only be edited using special mutations, or which are set programmatically.
 */
export const computedFields = {
  active: v.optional(v.boolean()),
  modifiedAt: v.optional(v.number()),
};
