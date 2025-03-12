import { z } from 'zod';

import { UserProfileNameVisibility, userProfileNameVisibilitySchema } from '~/types/UserProfileNameVisibility';

export const userProfileFormSchema = z.object({
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters.',
  }),
  givenName: z.string().min(2),
  familyName: z.string().min(2),
  nameVisibility: userProfileNameVisibilitySchema,
  countryCode: z.optional(z.string()),
});

export type UserProfileFormData = z.infer<typeof userProfileFormSchema> ;

export const defaultValues = {
  username: '',
  givenName: '',
  familyName: '',
  nameVisibility: 'hidden' as UserProfileNameVisibility,
  countryCode: '',
};
