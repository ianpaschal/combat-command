import { Infer, v } from 'convex/values';

import { fowV4MissionMatrixId } from './fowV4MissionMatrixId';
import { fowV4MissionPackId } from './fowV4MissionPackId';

export const fowV4GameSystemConfig = v.object({
  additionalRules: v.optional(v.object({
    allowMidWarMonsters: v.optional(v.union(v.literal('yes'), v.literal('combat'), v.literal('no'))),
  })),
  dynamicPointsVersion: v.optional(v.string()),
  era: v.string(),
  lessonsFromTheFrontVersion: v.string(),
  missionPackId: fowV4MissionPackId,
  missionMatrixId: fowV4MissionMatrixId,
  points: v.number(),
  // TODO: Add allowed/disallowed books/formations
  useExperimentalMissions: v.optional(v.boolean()),
});

export type FowV4GameSystemConfig = Infer<typeof fowV4GameSystemConfig>;
