import { getMissionMatrixOptions, MissionPackVersion } from '@ianpaschal/combat-command-static-data/flamesOfWarV4';
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
  lessonsFromTheFrontVersion: z.nativeEnum(LessonsFromTheFrontVersion, {
    errorMap: () => ({ message: 'Please select a LFTF version.' }),
  }),

  // Non-editable
  dynamicPointsVersion: z.optional(z.nativeEnum(DynamicPointsVersion)),
  missionMatrix: z.union([z.literal('default'), z.literal('extended')]),
  missionPackVersion: z.nativeEnum(MissionPackVersion, {
    errorMap: () => ({ message: 'Please select a mission pack version.' }),
  }),
  useExperimentalMissions: z.optional(z.boolean()),
}).superRefine((values, ctx) => {
  const matrixOptions = getMissionMatrixOptions(values.missionPackVersion).map(({ value }) => value);
  if (!matrixOptions.includes(values.missionMatrix)) {
    ctx.addIssue({
      message: 'Please select a valid mission matrix.',
      code: z.ZodIssueCode.custom,
      path: ['details.missionMatrix'],
    });
  }
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
