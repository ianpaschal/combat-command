import {
  DynamicPointsVersion,
  Era,
  LessonsFromTheFrontVersion,
  MissionPackVersion,
} from '@ianpaschal/combat-command-static-data/flamesOfWarV4';
import { Infer, v } from 'convex/values';

import { fowV4DynamicPointsVersionId } from '../../static/fowV4/dynamicPointsVersions';
import { fowV4EraId } from '../../static/fowV4/eras';
import { fowV4LessonsFromTheFrontVersionId } from '../../static/fowV4/lessonsFromTheFrontVersions';
import { fowV4MissionMatrixId, fowV4MissionPackId } from '../../static/fowV4/missionPacks';
import { getStaticEnumConvexValidator } from '../common/_helpers/getStaticEnumConvexValidator';

const dynamicPointsVersion = getStaticEnumConvexValidator(DynamicPointsVersion);
const era = getStaticEnumConvexValidator(Era);
const lessonsFromTheFrontVersion = getStaticEnumConvexValidator(LessonsFromTheFrontVersion);
const missionPackVersion = getStaticEnumConvexValidator(MissionPackVersion);

export const fowV4GameSystemConfig = v.object({
  additionalRules: v.optional(v.object({
    allowMidWarMonsters: v.optional(v.union(v.literal('yes'), v.literal('combat'), v.literal('no'))),
  })),
  dynamicPointsVersionId: v.optional(fowV4DynamicPointsVersionId), // TODO: REMOVE AFTER MIGRATION
  dynamicPointsVersion: v.optional(dynamicPointsVersion),
  points: v.number(),
  eraId: v.optional(fowV4EraId), // TODO: REMOVE AFTER MIGRATION
  era: v.optional(era),
  lessonsFromTheFrontVersionId: v.optional(fowV4LessonsFromTheFrontVersionId), // TODO: REMOVE AFTER MIGRATION
  lessonsFromTheFrontVersion: v.optional(lessonsFromTheFrontVersion),
  missionPackId: v.optional(fowV4MissionPackId), // TODO: REMOVE AFTER MIGRATION
  missionPackVersion: v.optional(missionPackVersion),
  missionMatrixId: v.optional(fowV4MissionMatrixId), // TODO: REMOVE AFTER MIGRATION
  missionMatrix: v.optional(v.union(v.literal('default'), v.literal('extended'))),
  // TODO: Add allowed/disallowed books/formations
  useExperimentalMissions: v.optional(v.boolean()),
});

export type FowV4GameSystemConfig = Infer<typeof fowV4GameSystemConfig>;
