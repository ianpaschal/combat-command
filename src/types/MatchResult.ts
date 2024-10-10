import { z } from 'zod';

import { DbRecord } from '~/types/DbRecord';
import { fowV4GameSystemConfigSchema } from '~/types/fowV4/fowV4GameSystemConfigSchema';
import { fowV4MatchOutcomeSchema } from '~/types/fowV4/fowV4MatchOutcomeSchema';

export const matchResultSchema = z.object({
  game_system_config: fowV4GameSystemConfigSchema, // TODO: Replace with a union of other game systems
  game_system_id: z.string(),
  outcome: fowV4MatchOutcomeSchema, // TODO: Replace with a union of other game systems
  player_0_user_id: z.string().uuid(),
  player_0_list_id: z.optional(z.string().uuid()),
  player_0_notes: z.optional(z.string()),
  player_0_notes_private: z.optional(z.boolean()),
  player_1_user_id: z.string().uuid(),
  player_1_list_id: z.optional(z.string().uuid()),
  player_1_notes: z.optional(z.string()),
  player_1_notes_private: z.optional(z.boolean()),
  tournament_id: z.optional(z.string().uuid()),
  tournament_pairing_id: z.optional(z.string().uuid()),
  // match_type: z.optional()
});

export type MatchResult = z.infer<typeof matchResultSchema>;

export type MatchResultRecord = MatchResult & DbRecord;