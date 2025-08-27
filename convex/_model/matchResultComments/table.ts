import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const editableFields = {
  body: v.string(),
  matchResultId: v.id('matchResults'),
};

export const computedFields = {
  userId: v.id('users'),
  modifiedAt: v.optional(v.number()),
};

export default defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_user_id', ['userId'])
  .index('by_match_result_id', ['matchResultId']);
