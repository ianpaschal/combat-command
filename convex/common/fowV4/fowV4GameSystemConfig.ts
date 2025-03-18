import { Infer, v } from 'convex/values';

import { fowV4MissionMatrixId, fowV4MissionPackId } from '../../static/fowV4/missionPacks';

export const fowV4GameSystemConfig = v.object({
  additionalRules: v.optional(v.object({
    allowMidWarMonsters: v.optional(v.union(v.literal('yes'), v.literal('combat'), v.literal('no'))),
  })),
  dynamicPointsVersion: v.optional(v.string()),
  dynamicPointsVersionId: v.optional(v.string()),
  era: v.optional(v.string()), // TODO: Enforce FowV4Era
  eraId: v.optional(v.string()), // TODO: Enforce FowV4Era
  lessonsFromTheFrontVersion: v.optional(v.string()),
  lessonsFromTheFrontVersionId: v.optional(v.string()),
  missionPackId: v.union(fowV4MissionPackId, v.string()), // FIXME: Revert to fowV4MissionPackId
  missionMatrixId: v.union(fowV4MissionMatrixId, v.string()), // FIXME: Revert to fowV4MissionMatrixId
  points: v.number(),
  // TODO: Add allowed/disallowed books/formations
  useExperimentalMissions: v.optional(v.boolean()),
});

export type FowV4GameSystemConfig = Infer<typeof fowV4GameSystemConfig>;
