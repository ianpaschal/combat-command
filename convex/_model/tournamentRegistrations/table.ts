import { defineTable } from 'convex/server';
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
  confirmed: v.optional(v.boolean()),
  modifiedAt: v.optional(v.number()),

  // Deprecated fields:
  userConfirmed: v.optional(v.boolean()),
  listApproved: v.optional(v.boolean()),
};

export default defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_tournament', ['tournamentId'])
  .index('by_tournament_user', ['tournamentId', 'userId'])
  .index('by_tournament_competitor', ['tournamentCompetitorId'])
  .index('by_tournament_competitor_user', ['tournamentCompetitorId', 'userId'])
  .index('by_user', ['userId']);
