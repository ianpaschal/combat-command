import { z } from 'zod';

import { fowV4EraSchema } from '~/types/fowV4/fowV4EraSchema';

export const fowV4GameSystemConfigSchema = z.object({
  additionalRules: z.object({
    allowMidWarMonsters: z.optional(z.union([z.literal('yes'), z.literal('combat'), z.literal('no')])),
  }),
  dynamicPointsVersion: z.string(), // Empty = not used, 'current' = version from time of match // mw_2023_2023-02-09 or mw_2024_2023-12-20
  era: fowV4EraSchema,
  lessonsFromTheFrontVersion: z.string(),
  missionPackVersion: z.string(),
  points: z.number({ message: 'Please enter a number.' }).min(5, { message: 'Matches must be played with at least 5 points.' }),
  // TODO: Add allowed/disallowed books/formations
});

export type FowV4GameSystemConfig = z.infer<typeof fowV4GameSystemConfigSchema>;
