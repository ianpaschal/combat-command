import { v } from 'convex/values';

export const editableFields = {
  email: v.string(),
  invitedByUserId: v.id('users'),
  userId: v.id('users'),
  secret: v.string(),
};

export const computedFields = {
  modifiedAt: v.optional(v.number()),
};
