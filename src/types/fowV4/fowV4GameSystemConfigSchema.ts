import { z } from 'zod';

import { fowV4EraSchema } from '~/types/fowV4/fowV4EraSchema';

export const fowV4GameSystemConfigSchema = z.object({

  // Rule add-ons
  lessons_from_the_front_version: z.string(),
  mission_pack_version: z.string(),

  // Game properties
  era: fowV4EraSchema,
  points: z.number().min(0),

  // List properties
  // TODO: (maybe move to a list restrictions config?)
  dynamic_points_version: z.optional(z.string()), // Empty = not used, 'current' = version from time of match // mw_2023_2023-02-09 or mw_2024_2023-12-20
  allow_mid_war_monsters: z.optional(z.union([z.literal('yes'), z.literal('combat'), z.literal('no')])),

  // TODO: Add allowed/disallowed books/formations
});

export type FowV4GameSystemConfig = z.infer<typeof fowV4GameSystemConfigSchema>;