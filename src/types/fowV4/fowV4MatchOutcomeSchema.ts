import { z } from 'zod';

import { fowV4stanceSchema } from '~/types/fowV4/fowV4BattlePlanSchema';
import { fowV4MatchOutcomeTypeSchema } from '~/types/fowV4/fowV4MatchOutcomeTypeSchema';

export const fowV4MatchOutcomeSchema = z.object({
  attacker: z.number({ message: 'Please select an attacker' }).min(0).max(1),
  firstTurn: z.number({ message: 'Please select who had first turn' }).min(0).max(1),
  mission_id: z.string({ message: 'Please select a mission' }),
  outcome_type: fowV4MatchOutcomeTypeSchema,
  player_0_stance: fowV4stanceSchema,
  player_0_units_lost: z.number().min(0),
  player_1_stance: fowV4stanceSchema,
  player_1_units_lost: z.number().min(0),
  turns_played: z.coerce.number().min(1),
  winner: z.union([z.number().min(0).max(1), z.null()]),
}).superRefine((values, ctx) => {
  if (values.outcome_type !== 'time_out' && values.winner === undefined) {
    ctx.addIssue({
      message: 'Please select a winner',
      code: z.ZodIssueCode.custom,
      path: ['winner'],
    });
  }
});

export type FowV4MatchOutcomeFormData = z.infer<typeof fowV4MatchOutcomeSchema>;
