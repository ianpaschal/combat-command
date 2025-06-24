import { z } from 'zod';

import {
  FowV4DynamicPointsVersionId,
  FowV4EraId,
  FowV4LessonsFromTheFrontVersionId,
  FowV4MissionMatrixId,
  FowV4MissionPackId,
} from '~/api';

export const fowV4GameSystemConfigFormSchema = z.object({
  // Tournament restrictions
  additionalRules: z.optional(z.object({
    allowMidWarMonsters: z.optional(z.union([z.literal('yes'), z.literal('combat'), z.literal('no')])),
  })),

  // Basic options
  eraId: z.string().transform((val) => val as FowV4EraId),
  points: z.coerce.number(),

  // Advanced options (hidden by default)
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

export type FowV4GameSystemConfigFormData = z.infer<typeof fowV4GameSystemConfigFormSchema>;

export const fowV4GameSystemConfigDefaultValues: FowV4GameSystemConfigFormData = {
  // Tournament restrictions
  additionalRules: {},

  // Basic options
  eraId: 'flames_of_war_v4::era::late_war',
  points: 100,

  // Advanced options (hidden by default)
  lessonsFromTheFrontVersionId: 'flames_of_war_v4::lessons_from_the_front_version::2024_03',

  // Non-editable
  dynamicPointsVersionId: undefined,
  missionMatrixId: 'flames_of_war_v4::mission_matrix::2023_04_extended',
  missionPackId: 'flames_of_war_v4::mission_pack::2023_04',
  useExperimentalMissions: true,
};
