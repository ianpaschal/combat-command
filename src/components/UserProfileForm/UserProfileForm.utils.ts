import { z } from 'zod';

import { UserProfileNameVisibility, userProfileNameVisibilitySchema } from '~/types/UserProfileNameVisibility';

export const userProfileFormSchema = z.object({
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters.',
  }),
  given_name: z.string().min(2),
  family_name: z.string().min(2),
  name_visibility: userProfileNameVisibilitySchema,
  country_code: z.union([z.string(), z.null()]),
});

export type UserProfileFormData = z.infer<typeof userProfileFormSchema> ;

export const defaultValues = {
  username: '',
  given_name: '',
  family_name: '',
  name_visibility: 'hidden' as UserProfileNameVisibility,
  country_code: '',
};