import { v } from 'convex/values';

export const editableFields = {
  teamName: v.optional(v.string()),
};

/**
 * Fields which an only be set on creation, and then should be considered to belong to the computed fields below.
 */
export const createOnlyFields = {
  tournamentId: v.id('tournaments'),
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
