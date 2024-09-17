import { z } from 'zod';

const eraSchema = z.union([
  z.literal('ew'),
  z.literal('mw'),
  z.literal('lw'),
  z.literal('lwl'),
  z.literal('pacific'),
]);

export type Era = z.infer<typeof eraSchema>;

const stanceSchema = z.union([
  z.literal('attack'),
  z.literal('maneuver'),
  z.literal('defend'),
]);

export type Stance = z.infer<typeof stanceSchema>;

const outcomeTypeSchema = z.union([
  z.literal('objective_taken'),
  z.literal('objective_defended'),
  z.literal('time_out'),
  z.literal('force_broken'),
]);

export type OutcomeType = z.infer<typeof outcomeTypeSchema>;

export const fowV4MatchConfigSchema = z.object({
  era: eraSchema,
  points: z.coerce.number().min(0).max(500),
  rule_add_ons: z.array(z.string()),
  mission_pack: z.string(),
});

export const fowV4MatchResultSchema = z.object({
  mission_id: z.string(),
  outcome_type: outcomeTypeSchema,
  player_0_stance: stanceSchema,
  player_0_units_lost: z.coerce.number().min(0),
  player_1_stance: stanceSchema,
  player_1_units_lost: z.coerce.number().min(0),
  winner: z.optional(z.coerce.number().min(0).max(1)),
  turns_played: z.coerce.number().min(1),
  attacker: z.coerce.number().min(0).max(1),
});