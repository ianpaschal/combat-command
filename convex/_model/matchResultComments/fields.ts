import { v } from 'convex/values';

export const editableFields = {
  body: v.string(),
  matchResultId: v.id('matchResults'),
};

export const computedFields = {
  userId: v.id('users'),
  modifiedAt: v.optional(v.number()),
};
