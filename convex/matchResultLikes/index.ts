import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const fields = {
  matchResultId: v.id('matchResults'),
};

const table = defineTable({
  ...fields,
  userId: v.id('users'),
}).index(
  'by_user_id', ['userId'],
).index(
  'by_match_result_id', ['matchResultId'],
).index(
  'by_user_id_match_result_id', ['userId', 'matchResultId'],
);

export {
  fields as matchResultLikeFields,
  table as matchResultLikes,
};
