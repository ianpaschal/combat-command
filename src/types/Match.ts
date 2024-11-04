import { z } from 'zod';

import { DbRecord } from '~/types/DbRecord';
import { fowV4MatchOutcomeSchema } from '~/types/fowV4/fowV4MatchOutcomeSchema';

export const matchSchema = z.object({
  game_system_config_id: z.union([z.string().uuid(), z.null()]),
  tournament_pairing_id: z.union([z.string().uuid(), z.null()]),
  player_0_id: z.union([z.string().uuid(), z.null()]),
  player_1_id: z.union([z.string().uuid(), z.null()]),
  outcome: fowV4MatchOutcomeSchema, // TODO: Replace with a union of other game systems
});

export const tournamentMatchFormSchema = z.object({
  tournament_pairing_id: z.union([z.string().uuid(), z.null()]),
  player_0_id: z.union([z.string().uuid(), z.null()]),
  player_1_id: z.union([z.string().uuid(), z.null()]),
  outcome: fowV4MatchOutcomeSchema, // TODO: Replace with a union of other game systems
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