import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { userDataVisibilityLevel } from '../common/userDataVisibilityLevel';

export const fields = {
  avatarStorageId: v.optional(v.id('_storage')),
  countryCode: v.optional(v.string()),
  familyName: v.optional(v.string()),
  givenName: v.optional(v.string()),
  locationVisibility: v.optional(userDataVisibilityLevel), 
  nameVisibility: v.optional(userDataVisibilityLevel),
  username: v.optional(v.string()),
};

export const table = defineTable({
  ...fields,
  email: v.string(),
  emailVerificationTime: v.optional(v.number()),
  modifiedAt: v.optional(v.number()),
}).index(
  'by_country_code', ['countryCode'],
).index(
  'by_name', ['givenName', 'familyName'],
).index(
  'by_username', ['username'],
);

export {
  fields as userFields,
  table as users,
};
