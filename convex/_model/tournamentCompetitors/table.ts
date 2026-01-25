import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { scoreAdjustment } from '../common/scoreAdjustment';

export const editableFields = {
  captainUserId: v.optional(v.id('users')),
  scoreAdjustments: v.optional(v.array(scoreAdjustment)),
  teamName: v.optional(v.string()),
  tournamentId: v.id('tournaments'),
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
