import { Infer, v } from 'convex/values';

export const userDataVisibilityLevel = v.union(
  v.literal('hidden'), 
  v.literal('friends'),
  v.literal('clubs'),
  v.literal('tournaments'),
  v.literal('community'),
  v.literal('public'),
);

export type UserDataVisibilityLevel = Infer<typeof userDataVisibilityLevel>;
