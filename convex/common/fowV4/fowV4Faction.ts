import { Infer, v } from 'convex/values';

export const fowV4Faction = v.union(
  v.literal('germany'),
  v.literal('soviet_union'),
  v.literal('united_states'),
  v.literal('great_britain_commonwealth'),
  v.literal('italy'),
  v.literal('finland'),
  v.literal('hungary'),
  v.literal('romania'),
  v.literal('japan'),
);

export type FowV4Faction = Infer<typeof fowV4Faction>;
