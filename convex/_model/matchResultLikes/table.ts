import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const editableFields = {
  matchResultId: v.id('matchResults'),
};

export const computedFields = {
  userId: v.id('users'),
};

export default defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_user_id', ['userId'])
  .index('by_match_result_id', ['matchResultId'])
  .index('by_user_id_match_result_id', ['userId', 'matchResultId']);
