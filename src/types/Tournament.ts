import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { fowV4GameSystemConfigSchema } from '~/types/fowV4/fowV4GameSystemConfigSchema';
import { tournamentPairingMethodSchema } from '~/types/TournamentPairingMethod';
import { tournamentStatusSchema } from '~/types/TournamentStatus';

const tournamentSchema = z.object({
  competitor_count: z.coerce.number().min(2, 'Tournaments require at least two competitors.'),
  competitor_groups: z.array(z.object({
    name: z.string().min(1).max(20),
    size: z.coerce.number().min(1),
  })),
  competitor_size: z.coerce.number(),
  current_round: z.optional(z.number()),
  // TODO: How to handle round timing? especially pauses
  description: z.optional(z.string().max(1000, 'Descriptions are limited to 1000 characters.')),
  end_date: z.string(),
  end_time: z.string(),
  game_system_id: z.string(),
  location: z.string(),
  logo_url: z.optional(z.string().url('Please provide a valid URL.')).or(z.literal('')),
  organizer_ids: z.array(z.string().uuid()),
  registrations_open: z.boolean(),
  round_count: z.number(),
  rules_pack_url: z.optional(z.string().url('Please provide a valid URL.')).or(z.literal('')),
  start_date: z.string(),
  start_time: z.string(),
  status: tournamentStatusSchema,
  title: z.string().min(5),
  use_national_teams: z.boolean(),
  registrations_close_at: z.string(),
  game_system_config: fowV4GameSystemConfigSchema, // TODO: Replace with a union of other game systems
  pairing_method: tournamentPairingMethodSchema,
  ranking_factors: z.array(z.string()),
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

export type TournamentRecord = Tournament & {
  id: string;
  created_at: string;
  modified_at?: string;
};
