import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { createLocalDatetimeString } from '~/components/generic/InputDateTime';
import { fowV4GameSystemConfigSchema } from '~/types/fowV4/fowV4GameSystemConfigSchema';
import { tournamentPairingMethodSchema } from '~/types/TournamentPairingMethod';

export const tournamentFormSchema = z.object({

  // General
  title: z.string()
    .min(5, 'Title must be at least 5 characters.')
    .max(40, 'Titles are limited to 40 characters.'),
  description: z.string().min(10, 'Please add a description.').max(1000, 'Descriptions are limited to 1000 characters.'),
  rulesPackUrl: z.union([z.string().url('Please provide a valid URL.'), z.literal('')]),
  location: z.object({
    placeId: z.string(),
    lat: z.number(),
    lon: z.number(),
  }),
  // banner_url: z.union([z.string().url('Please provide a valid URL.'), z.literal(''), z.null()]),

  startsAtLocal: z.string(),
  endsAtLocal: z.string(),
  registrationClosesAtLocal: z.string(),

  // Format Config
  competitorCount: z.coerce.number().min(2, 'Tournaments require at least two competitors.'),
  // competitorGroups: z.array(z.object({
  //   name: z.string().min(1).max(20),
  //   size: z.coerce.number().min(1),
  // })),
  competitorSize: z.coerce.number(),
  useNationalTeams: z.boolean(),
  requireRealNames: z.boolean(),
  roundCount: z.number(),
  pairingMethod: tournamentPairingMethodSchema,

  // Game Config
  gameSystem: z.literal('flames_of_war_4th_edition'),
  gameSystemConfig: fowV4GameSystemConfigSchema, // TODO: Replace with a union of other game systems
  rankingFactors: z.array(z.union([z.literal('total_wins'), z.literal('total_points')])),

}).refine(data => {
  if (data.gameSystem === 'flames_of_war_4th_edition') {
    return fowV4GameSystemConfigSchema.safeParse(data.gameSystemConfig).success;
  }
  return false; // Return false if no valid game_system_id matches
}, {
  message: 'Invalid config for the selected game system.',
  path: ['gameSystemConfig'], // Highlight the game_system_config field in case of error
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
  registrationClosesAtLocal: new Date().toISOString(),
  endsAtLocal: createLocalDatetimeString({ hours: 18 }),
  roundCount: 3,
  location: {
    placeId: '',
    lat: 0,
    lon: 0,
  },
  rulesPackUrl: '',
  pairingMethod: 'swiss',
  rankingFactors: [],
  title: '',
  gameSystem: 'flames_of_war_4th_edition',
  gameSystemConfig: {
    era: 'lw',
    points: 100,
    lessonsFromTheFrontVersion: '2024-03',
    dynamicPointsVersion: '2025-01',
    missionPackVersion: '2023-04',
    additionalRules: {
      allowMidWarMonsters: 'no',
    },
  },
};
