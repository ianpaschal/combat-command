import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const fields = {
  body: v.string(),
  matchResultId: v.id('matchResults'),
};

const table = defineTable({
  ...fields,
  userId: v.id('users'),
  modifiedAt: v.optional(v.number()),
}).index(
  'by_user_id', ['userId'],
).index(
  'by_match_result_id', ['matchResultId'],
);

export {
  fields as matchResultCommentFields,
  table as matchResultComments,
};
