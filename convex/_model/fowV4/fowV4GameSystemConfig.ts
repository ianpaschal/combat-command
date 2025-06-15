import { Infer, v } from 'convex/values';

import { fowV4DynamicPointsVersionId } from '../../static/fowV4/dynamicPointsVersions';
import { fowV4EraId } from '../../static/fowV4/eras';
import { fowV4LessonsFromTheFrontVersionId } from '../../static/fowV4/lessonsFromTheFrontVersions';
import { fowV4MissionMatrixId, fowV4MissionPackId } from '../../static/fowV4/missionPacks';

export const fowV4GameSystemConfig = v.object({
  additionalRules: v.optional(v.object({
    allowMidWarMonsters: v.optional(v.union(v.literal('yes'), v.literal('combat'), v.literal('no'))),
  })),
  dynamicPointsVersionId: v.optional(fowV4DynamicPointsVersionId),
  points: v.number(),
  eraId: fowV4EraId,
  lessonsFromTheFrontVersionId: fowV4LessonsFromTheFrontVersionId,
  missionPackId: fowV4MissionPackId,
  missionMatrixId: fowV4MissionMatrixId,
  // TODO: Add allowed/disallowed books/formations
  useExperimentalMissions: v.optional(v.boolean()),
});

export type FowV4GameSystemConfig = Infer<typeof fowV4GameSystemConfig>;
