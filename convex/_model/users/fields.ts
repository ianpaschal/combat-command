import { v } from 'convex/values';

import { userDataVisibilityLevel } from '../../common/userDataVisibilityLevel';

export const editableFields = {
  avatarStorageId: v.optional(v.id('_storage')),
  countryCode: v.optional(v.string()),
  familyName: v.optional(v.string()),
  givenName: v.optional(v.string()),
  locationVisibility: v.optional(userDataVisibilityLevel), 
  nameVisibility: v.optional(userDataVisibilityLevel),
  username: v.optional(v.string()),
};

export const computedFields = {
  email: v.string(),
  emailVerificationTime: v.optional(v.number()),
  modifiedAt: v.optional(v.number()),
};
