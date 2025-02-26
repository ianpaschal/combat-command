import { Infer, v } from 'convex/values';

export const fowV4BattlePlan = v.union(
  v.literal('attack'),
  v.literal('maneuver'),
  v.literal('defend'),
);

export type FowV4BattlePlan = Infer<typeof fowV4BattlePlan>;
