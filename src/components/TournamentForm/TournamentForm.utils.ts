import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns-tz';
import { z } from 'zod';

import { createLocalDatetimeString, localTimeFormat } from '~/components/generic/InputDateTime';
import { fowV4GameSystemConfigSchema } from '~/types/fowV4/fowV4GameSystemConfigSchema';
import { tournamentPairingMethodSchema } from '~/types/TournamentPairingMethod';

export const tournamentFormSchema = z.object({

  // General
  title: z.string()
    .min(5, 'Title must be at least 5 characters.')
    .max(40, 'Titles are limited to 40 characters.'),
  description: z.optional(z.string().max(1000, 'Descriptions are limited to 1000 characters.')),
  rulesPackUrl: z.union([z.string().url('Please provide a valid URL.'), z.literal(''), z.null()]),
  locationId: z.string(),
  // banner_url: z.union([z.string().url('Please provide a valid URL.'), z.literal(''), z.null()]),

  startsAtLocal: z.string(),
  endsAtLocal: z.string(),
  registrationClosesDate: z.string(),
  registrationClosesTimeLocal: z.string(),

  // Format Config
  competitorCount: z.coerce.number().min(2, 'Tournaments require at least two competitors.'),
  // competitor_groups: z.array(z.object({
  //   name: z.string().min(1).max(20),
  //   size: z.coerce.number().min(1),
  // })),
  competitorSize: z.coerce.number(),
  useNationalTeams: z.boolean(),
  requireRealNames: z.boolean(),
  roundCount: z.number(),
  pairingMethod: tournamentPairingMethodSchema,

  // Game Config
  gameSystem: z.string().uuid(),
  gameSystemConfig: fowV4GameSystemConfigSchema, // TODO: Replace with a union of other game systems
  rankingFactors: z.array(z.string()),

}).refine(data => {
  if (data.gameSystem === 'flames_of_war_v4') {
    return fowV4GameSystemConfigSchema.safeParse(data.gameSystemConfig).success;
  }
  return false; // Return false if no valid game_system_id matches
}, {
  message: 'Invalid config for the selected game system.',
  path: ['game_system_config'], // Highlight the game_system_config field in case of error
});

export const tournamentFormResolver = zodResolver(tournamentFormSchema);

export type TournamentFormData = z.infer<typeof tournamentFormSchema>;

export const defaultValues: TournamentFormData = {
  competitorCount: 20,
  // competitorGroups: [{ name: 'All Competitors', size: 10 }],
  competitorSize: 1,
  useNationalTeams: false,
  requireRealNames: true,
  description: '',
  startsAtLocal: createLocalDatetimeString({ hours: 9 }),
  registrationClosesDate: '',
  registrationClosesTimeLocal: '',
  endsAtLocal: createLocalDatetimeString({ hours: 18 }),
  roundCount: 3,
  locationId: '',
  rulesPackUrl: '',
  pairingMethod: 'swiss',
  rankingFactors: ['foo'],
  title: '',
  gameSystem: '1e307db7-207b-4493-b563-8056535616cc', // Flames of War 4th Ed.
  gameSystemConfig: {
    era: 'lw',
    points: 100,
    lessons_from_the_front_version: '2024-03',
    allow_mid_war_monsters: 'no',
    mission_pack_version: '2023-04',
  },
};
