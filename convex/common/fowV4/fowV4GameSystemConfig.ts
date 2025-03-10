import { Infer, v } from 'convex/values';

export const fowV4GameSystemConfig = v.object({
  additionalRules: v.optional(v.object({
    allowMidWarMonsters: v.optional(v.union(v.literal('yes'), v.literal('combat'), v.literal('no'))),
  })),
  dynamicPointsVersion: v.optional(v.string()),
  era: v.string(),
  lessonsFromTheFrontVersion: v.string(),
  missionPackId: v.id('fowV4MissionPacks'),
  missionMatrixId: v.id('fowV4MissionMatrixes'),
  points: v.number(),
  // TODO: Add allowed/disallowed books/formations
});

export type FowV4GameSystemConfig = Infer<typeof fowV4GameSystemConfig>;
