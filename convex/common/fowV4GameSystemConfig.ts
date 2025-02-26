import { Infer, v } from 'convex/values';

export const fowV4GameSystemConfig = v.object({
  lessonsFromTheFrontVersion: v.string(),
  missionPackVersion: v.string(),
  era: v.string(),
  points: v.number(),
  dynamicPointsVersion: v.optional(v.string()),
  additionalRules: v.object({
    allowMidWarMonsters: v.optional(v.union(v.literal('yes'), v.literal('combat'), v.literal('no'))),
  }),
});

export type FowV4GameSystemConfig = Infer<typeof fowV4GameSystemConfig>;
