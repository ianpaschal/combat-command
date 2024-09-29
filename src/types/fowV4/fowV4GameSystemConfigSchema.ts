import { z } from 'zod';

import { fowV4BookSchema } from '~/types/fowV4/fowV4BookSchema';
import { fowV4EraSchema } from '~/types/fowV4/fowV4EraSchema';

export const fowV4GameSystemConfigSchema = z.object({
  dynamic_points: z.optional(z.boolean()),
  era: fowV4EraSchema,
  points: z.number().min(0),
  lessons_from_the_front_version: z.string(),
  mid_war_monsters: z.union([z.literal('yes'), z.literal('combat'), z.literal('no')]),
  mission_pack_version: z.string(),
  allowed_books: z.array(fowV4BookSchema),
});

export type FowV4GameSystemConfig = z.infer<typeof fowV4GameSystemConfigSchema>;