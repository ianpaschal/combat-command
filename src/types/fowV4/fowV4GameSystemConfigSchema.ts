import { z } from 'zod';

import {
  FowV4DynamicPointsVersionId,
  FowV4EraId,
  FowV4LessonsFromTheFrontVersionId,
  FowV4MissionMatrixId,
  FowV4MissionPackId,
} from '~/api';

export const fowV4GameSystemConfigSchema = z.object({
  // Tournament restrictions
  additionalRules: z.optional(z.object({
    allowMidWarMonsters: z.optional(z.union([z.literal('yes'), z.literal('combat'), z.literal('no')])),
  })),

  // Basic options
  eraId: z.string().transform((val) => val as FowV4EraId),
  points: z.number(),

  // Advanced option (hidden by default)
  lessonsFromTheFrontVersionId: z.string().transform((val) => val as FowV4LessonsFromTheFrontVersionId),

  // Non-editable
  dynamicPointsVersionId: z.optional(z.string().transform((val) => val as FowV4DynamicPointsVersionId)),
  missionMatrixId: z.string().transform((val) => val as FowV4MissionMatrixId),
  missionPackId: z.string().transform((val) => val as FowV4MissionPackId),
  useExperimentalMissions: z.optional(z.boolean()),
// eslint-disable-next-line @typescript-eslint/no-unused-vars
}).superRefine((values, ctx) => {
  // TODO: Verify that matrix ID matches pack ID
  // TODO: Verify that dynamic points version is compatible with era
  // if (values.details.outcomeType !== 'time_out' && values.details.winner === undefined) {
  //   ctx.addIssue({
  //     message: 'Please select a winner',
  //     code: z.ZodIssueCode.custom,
  //     path: ['winner'],
  //   });
  // }
});
