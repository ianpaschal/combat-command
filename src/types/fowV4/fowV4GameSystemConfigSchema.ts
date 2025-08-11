import {
  DynamicPointsVersion,
  Era,
  LessonsFromTheFrontVersion,
  MissionMatrix,
  MissionPackVersion,
} from '@ianpaschal/combat-command-static-data/flamesOfWarV4';
import { z } from 'zod';

export const fowV4GameSystemConfigSchema = z.object({
  // Tournament restrictions
  additionalRules: z.optional(z.object({
    allowMidWarMonsters: z.optional(z.union([z.literal('yes'), z.literal('combat'), z.literal('no')])),
  })),

  // Basic options
  era: z.string().transform((val) => val as Era),
  points: z.number(),

  // Advanced option (hidden by default)
  lessonsFromTheFrontVersion: z.string().transform((val) => val as LessonsFromTheFrontVersion),

  // Non-editable
  dynamicPointsVersion: z.optional(z.string().transform((val) => val as DynamicPointsVersion)),
  missionMatrixId: z.string().transform((val) => val as MissionMatrix),
  missionPackVersion: z.string().transform((val) => val as MissionPackVersion),
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
