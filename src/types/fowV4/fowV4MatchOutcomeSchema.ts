import { z } from 'zod';

import { fowV4MatchOutcomeTypeSchema } from '~/types/fowV4/fowV4MatchOutcomeTypeSchema';
import { fowV4stanceSchema } from '~/types/fowV4/fowV4StanceSchema';

export const fowV4MatchOutcomeSchema = z.object({
  attacker: z.coerce.number().min(0).max(1),
  mission_id: z.string(),
  outcome_type: fowV4MatchOutcomeTypeSchema,
  player_0_score: z.coerce.number().min(0).max(8),
  player_0_stance: fowV4stanceSchema,
  player_0_units_lost: z.coerce.number().min(0),
  player_1_score: z.coerce.number().min(0).max(8),
  player_1_stance: fowV4stanceSchema,
  player_1_units_lost: z.coerce.number().min(0),
  turns_played: z.coerce.number().min(1),
  winner: z.optional(z.coerce.number().min(0).max(1)), // TODO: Maybe make null 
});

export type FowV4MatchOutcome = z.infer<typeof fowV4MatchOutcomeSchema>;