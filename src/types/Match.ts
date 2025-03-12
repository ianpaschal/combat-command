import { z } from 'zod';

import { DbRecord } from '~/types/DbRecord';
import { fowV4BattlePlanSchema } from '~/types/fowV4/fowV4BattlePlanSchema';
import { fowV4MatchOutcomeSchema } from '~/types/fowV4/fowV4MatchOutcomeSchema';
import { fowV4MatchOutcomeTypeSchema } from '~/types/fowV4/fowV4MatchOutcomeTypeSchema';

export const matchSchema = z.object({
  game_system_config_id: z.union([z.string().uuid(), z.null()]),
  tournament_pairing_id: z.union([z.string().uuid(), z.null()]),
  player_0_id: z.union([z.string().uuid(), z.null()]),
  player_1_id: z.union([z.string().uuid(), z.null()]),
  outcome: fowV4MatchOutcomeSchema, // TODO: Replace with a union of other game systems
});

export const tournamentMatchFormSchema = z.object({
  tournamentPairingId: z.union([z.string().uuid(), z.null()]),
  player_0_id: z.string().uuid(),
  player_1_id: z.string().uuid(),
  attacker: z.union([z.literal(0), z.literal(1)], { message: 'Please select an attacker' }),
  first_turn: z.union([z.literal(0), z.literal(1)], { message: 'Please select who had first turn' }),
  mission_id: z.string({ message: 'Please select a mission' }),
  outcome_type: fowV4MatchOutcomeTypeSchema,
  player_0_stance: fowV4BattlePlanSchema,
  player_0_units_lost: z.number().min(0),
  player_1_stance: fowV4BattlePlanSchema,
  player_1_units_lost: z.number().min(0),
  turns_played: z.coerce.number().min(1),
  winner: z.union([z.literal(0), z.literal(1), z.null()]),
}).superRefine((values, ctx) => {
  if (values.outcome_type !== 'time_out' && values.winner === undefined) {
    ctx.addIssue({
      message: 'Please select a winner',
      code: z.ZodIssueCode.custom,
      path: ['winner'],
    });
  }
});

export const singleMatchFormSchema = z.object({
  player_0: z.union([z.string().uuid(), z.null()]),
  player_1: z.union([z.string().uuid(), z.null()]),
  outcome: fowV4MatchOutcomeSchema, // TODO: Replace with a union of other game systems
});

export type Match = z.infer<typeof matchSchema>;
export type TournamentMatchFormData = z.infer<typeof tournamentMatchFormSchema>;
export type SingleMatchFormData = z.infer<typeof singleMatchFormSchema>;

export type MatchRecord = DbRecord & Omit<Match, 'game_system_config' | 'outcome' | 'players'> & {
  game_system_config_id: string;
  outcome_id: string;
  player_ids: string[];
};
