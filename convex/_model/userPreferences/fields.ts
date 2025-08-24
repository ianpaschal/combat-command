import { v } from 'convex/values';

import { themePreference } from '../../static/themes';

export const editableFields = {
  theme: v.optional(themePreference),
};

export const computedFields = {
  userId: v.id('users'),
  modifiedAt: v.optional(v.number()),
};
