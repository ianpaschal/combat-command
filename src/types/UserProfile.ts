import { z } from 'zod';

import { DbRecord } from '~/types/DbRecord';
import { userProfileNameVisibilitySchema } from '~/types/UserProfileNameVisibility';

export const userProfileSchema = z.object({

  // Always visible
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters.',
  }),
  avatar_url: z.union([z.string().url(), z.null()]),

  // Visibility configurable
  given_name: z.string().min(2),
  family_name: z.string().min(2),
  name_visibility: userProfileNameVisibilitySchema,
  
  // Always hidden
  country_code: z.string(),
});

export type UserProfile = z.infer<typeof userProfileSchema> ;

export type UserProfileRecord = DbRecord & Omit<UserProfile, 'given_name' | 'family_name'> & {
  given_name?: string;
  family_name?: string;
};