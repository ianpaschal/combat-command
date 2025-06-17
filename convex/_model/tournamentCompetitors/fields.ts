import { v } from 'convex/values';

export const editableFields = {
  tournamentId: v.id('tournaments'),
  teamName: v.optional(v.string()),
  players: v.array(v.object({
    userId: v.id('users'),
    active: v.boolean(),
  })),
};

/**
 * Fields which can only be edited using special mutations, or which are set programmatically.
 */
export const computedFields = {
  active: v.optional(v.boolean()),
  modifiedAt: v.optional(v.number()),
};
