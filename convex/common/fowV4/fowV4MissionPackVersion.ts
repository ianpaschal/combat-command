import { Infer, v } from 'convex/values';

// Presumably 1 or 2 missing...
export const fowV4MissionPackVersion = v.union(
  v.literal('mission_pack_2021_03'),
  v.literal('mission_pack_2022_06'),
  v.literal('mission_pack_2023_04'),
);

export type FowV4MissionPackVersion = Infer<typeof fowV4MissionPackVersion>;
