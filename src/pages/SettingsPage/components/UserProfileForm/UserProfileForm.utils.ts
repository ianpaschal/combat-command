import { z } from 'zod';

import { Tournament, VisibilityLevel } from '~/api';

export const createSchema = (
  userTournaments: Tournament[],
) => z.object({
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters.',
  }),
  givenName: z.string().min(2),
  familyName: z.string().min(2),
  nameVisibility: z.number(),
  countryCode: z.optional(z.string()),
}).superRefine((data, ctx) => {
  const requireRealNames = userTournaments.some((tournament) => (
    tournament.requireRealNames && (tournament.status === 'published' || tournament.status === 'active')
  ));
  if (requireRealNames && data.nameVisibility < VisibilityLevel.Tournaments) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'You are currently registered in a tournament which requires real names.',
      path: ['nameVisibility'],
    });
  }
});

export type UserProfileFormData = z.infer<ReturnType<typeof createSchema>>;

export const defaultValues = {
  username: '',
  givenName: '',
  familyName: '',
  nameVisibility: VisibilityLevel.Hidden,
  countryCode: '',
};
