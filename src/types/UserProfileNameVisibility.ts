import { z, ZodLiteral } from 'zod';

export const userProfileNameVisibilitySchema = z.union([
  z.literal('hidden'),
  z.literal('friends'),
  z.literal('clubs'),
  z.literal('tournaments'),
  z.literal('public'),
], { message: 'Visibility must be set' });

export type UserProfileNameVisibility = z.infer<typeof userProfileNameVisibilitySchema>;

export const userProfileNameVisibilityLabels: Record<UserProfileNameVisibility, string> = {
  hidden: 'Hidden',
  friends: 'Friends',
  clubs: 'Clubs',
  tournaments: 'Tournaments',
  public: 'Public',
};

export const userProfileNameVisibilityOptions = userProfileNameVisibilitySchema.options.filter(
  (option) => option instanceof ZodLiteral,
).map(
  ({ value }) => ({ value, label: userProfileNameVisibilityLabels[value] }),
);