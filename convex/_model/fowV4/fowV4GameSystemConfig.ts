import {
  DynamicPointsVersion,
  Era,
  LessonsFromTheFrontVersion,
  MissionPackVersion,
} from '@ianpaschal/combat-command-static-data/flamesOfWarV4';
import { Infer, v } from 'convex/values';

import { getStaticEnumConvexValidator } from '../common/_helpers/getStaticEnumConvexValidator';

const dynamicPointsVersion = getStaticEnumConvexValidator(DynamicPointsVersion);
const era = getStaticEnumConvexValidator(Era);
const lessonsFromTheFrontVersion = getStaticEnumConvexValidator(LessonsFromTheFrontVersion);
const missionPackVersion = getStaticEnumConvexValidator(MissionPackVersion);

export const fowV4GameSystemConfig = v.object({
  additionalRules: v.optional(v.object({
    allowMidWarMonsters: v.optional(v.union(v.literal('yes'), v.literal('combat'), v.literal('no'))),
  })),
  dynamicPointsVersion: v.optional(dynamicPointsVersion),
  points: v.number(),
  era: v.optional(era),
  lessonsFromTheFrontVersion: v.optional(lessonsFromTheFrontVersion),
  missionPackVersion: v.optional(missionPackVersion),
  missionMatrix: v.optional(v.union(v.literal('default'), v.literal('extended'))),
  // TODO: Add allowed/disallowed books/formations
  useExperimentalMissions: v.optional(v.boolean()),
});

export type FowV4GameSystemConfig = Infer<typeof fowV4GameSystemConfig>;
