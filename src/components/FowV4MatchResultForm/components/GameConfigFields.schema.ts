import { MissionPackVersion } from '@ianpaschal/combat-command-static-data/flamesOfWarV4';
import {
  DynamicPointsVersion,
  Era,
  LessonsFromTheFrontVersion,
} from '@ianpaschal/combat-command-static-data/flamesOfWarV4';
import { z } from 'zod';

export const fowV4GameSystemConfigFormSchema = z.object({
  // Tournament restrictions
  additionalRules: z.optional(z.object({
    allowMidWarMonsters: z.optional(z.union([z.literal('yes'), z.literal('combat'), z.literal('no')])),
  })),

  // Basic options
  era: z.string().transform((val) => val as Era),
  points: z.coerce.number(),

  // Advanced options (hidden by default)
  lessonsFromTheFrontVersion: z.string().transform((val) => val as LessonsFromTheFrontVersion),

  // Non-editable
  dynamicPointsVersion: z.optional(z.string().transform((val) => val as DynamicPointsVersion)),
  missionMatrix: z.union([z.literal('default'), z.literal('extended')]),
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

export type FowV4GameSystemConfigFormData = z.infer<typeof fowV4GameSystemConfigFormSchema>;

export const fowV4GameSystemConfigDefaultValues: FowV4GameSystemConfigFormData = {
  // Tournament restrictions
  additionalRules: {},

  // Basic options
  era: Era.LW,
  points: 100,

  // Advanced options (hidden by default)
  lessonsFromTheFrontVersion: LessonsFromTheFrontVersion.Mar2024,

  // Non-editable
  dynamicPointsVersion: undefined,
  missionMatrix: 'extended',
  missionPackVersion: MissionPackVersion.Apr2023,
  useExperimentalMissions: true,
};
