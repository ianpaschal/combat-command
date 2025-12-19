import { v } from 'convex/values';

export const leagueStatus = v.union(
  v.literal('draft'),
  v.literal('active'),
  v.literal('archived'),
);
