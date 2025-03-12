import { z } from 'zod';

import { fowV4BattlePlanSchema } from '~/types/fowV4/fowV4BattlePlanSchema';

export const fowV4MatchPlayerResultSchema = z.object({
  score: z.coerce.number().min(0).max(8),
  stance: fowV4BattlePlanSchema,
  turns_played: z.coerce.number().min(1),
  units_lost: z.coerce.number().min(0),
});

export type FowV4MatchPlayerResult = z.infer<typeof fowV4MatchPlayerResultSchema>;
