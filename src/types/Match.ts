import { z } from 'zod';

import { DbRecord } from '~/types/DbRecord';
import { fowV4GameSystemConfigSchema } from '~/types/fowV4/fowV4GameSystemConfigSchema';
import { fowV4MatchOutcomeSchema } from '~/types/fowV4/fowV4MatchOutcomeSchema';

export const matchSchema = z.object({
  game_system_id: z.string(),

  // Saved in a separate table (fow_v4_game_system_configs) and replaced with a foreign key field
  game_system_config: fowV4GameSystemConfigSchema, // TODO: Replace with a union of other game systems
  
  // Saved in a separate table (fow_v4_match_outcomes) with foreign key for match_id
  outcome: fowV4MatchOutcomeSchema, // TODO: Replace with a union of other game systems

  // Filled in by joining another table (match_players)
  players: z.array(z.object({
    user_id: z.string().uuid(), // Foreign key
    list_id: z.optional(z.string().uuid()), // Foreign key
    notes: z.optional(z.string()),
    notes_private: z.optional(z.boolean()),
    confirmed: z.boolean(),
  })).min(2),

  // Tournament Info
  tournament_pairing_id: z.union([z.string().uuid(), z.null()]),
});

export type Match = z.infer<typeof matchSchema> ;

export type MatchRecord = DbRecord & Omit<Match, 'game_system_config' | 'outcome' | 'players'> & {
  game_system_config_id: string;
  outcome_id: string;
  player_ids: string[];
};