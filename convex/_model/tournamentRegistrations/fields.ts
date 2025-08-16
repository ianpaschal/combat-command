import { v } from 'convex/values';

export const editableFields = {
  userId: v.id('users'),
  tournamentId: v.id('tournaments'),
  tournamentCompetitorId: v.id('tournamentCompetitors'),
};

/**
 * Fields which can only be edited using special mutations, or which are set programmatically.
 */
export const computedFields = {
  listId: v.optional(v.id('lists')),
  active: v.optional(v.boolean()),
  userConfirmed: v.boolean(),
  listApproved: v.boolean(),
  modifiedAt: v.optional(v.number()),
};
