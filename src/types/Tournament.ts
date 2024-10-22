import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { DbRecord } from '~/types/DbRecord';
import { fowV4GameSystemConfigSchema } from '~/types/fowV4/fowV4GameSystemConfigSchema';
import { tournamentPairingMethodSchema } from '~/types/TournamentPairingMethod';
import { tournamentStatusSchema } from '~/types/TournamentStatus';

const tournamentSchema = z.object({

  // Metadata
  title: z.string()
    .min(5, 'Title must be at least 5 characters.')
    .max(40, 'Titles are limited to 40 characters.'),
  description: z.optional(z.string().max(1000, 'Descriptions are limited to 1000 characters.')),
  location: z.string(),
  banner_url: z.union([z.string().url('Please provide a valid URL.'), z.literal(''), z.null()]),
  starts_at: z.string(),
  ends_at: z.string(),
  rules_pack_url: z.union([z.string().url('Please provide a valid URL.'), z.literal(''), z.null()]),

  // Format Config
  competitor_count: z.coerce.number().min(2, 'Tournaments require at least two competitors.'),
  competitor_groups: z.array(z.object({
    name: z.string().min(1).max(20),
    size: z.coerce.number().min(1),
  })),
  competitor_size: z.coerce.number(),
  use_national_teams: z.boolean(),
  round_count: z.number(),
  pairing_method: tournamentPairingMethodSchema,

  // Game Config
  game_system_id: z.string(),
  game_system_config: fowV4GameSystemConfigSchema, // TODO: Replace with a union of other game systems
  ranking_factors: z.array(z.string()),

  // Management
  organizer_ids: z.array(z.string().uuid()),
  current_round: z.optional(z.number()),
  status: tournamentStatusSchema,
  registrations_open: z.boolean(),
  registrations_close_at: z.string(),
  require_real_names: z.boolean(),

}).refine(data => {
  if (data.game_system_id === 'flames_of_war_v4') {
    return fowV4GameSystemConfigSchema.safeParse(data.game_system_config).success;
  }
  return false; // Return false if no valid game_system_id matches
}, {
  message: 'Invalid config for the selected game system.',
  path: ['game_system_config'], // Highlight the game_system_config field in case of error
});

export const tournamentResolver = zodResolver(tournamentSchema);

export type Tournament = z.infer<typeof tournamentSchema>;

export type TournamentRecord = Tournament & DbRecord;
