import { DeepPartial } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CurrencyCode,
  GameSystem,
  TournamentPairingMethod,
} from '@ianpaschal/combat-command-static-data/common';
import { RankingFactor } from '@ianpaschal/combat-command-static-data/flamesOfWarV4';
import { z } from 'zod';

import { StorageId, UserId } from '~/api';
import { fowV4GameSystemConfigDefaultValues, fowV4GameSystemConfigFormSchema } from '~/components/FowV4MatchResultForm/components/GameConfigFields.schema';

// TODO: Add competitor groups
// TODO: Convert gameSystemConfig to union of other game systems
export const tournamentFormSchema = z.object({

  // General
  title: z.string().min(3, 'Title must be at least 3 characters.').max(40, 'Titles are limited to 40 characters.'),
  editionYear: z.coerce.number(),
  description: z.string().min(10, 'Please add a description.').max(1000, 'Descriptions are limited to 1000 characters.'),
  rulesPackUrl: z.union([z.string().url('Please provide a valid URL.'), z.literal('')]),
  location: z.object({
    mapboxId: z.string(),
    name: z.string(),
    placeFormatted: z.string(),
    timeZone: z.string(),
    
    // This information could be retrieved later, but putting it in the model makes us backwards
    // compatible if we eventually look up address info differently, or want to let the user edit it
    address: z.optional(z.string()),
    neighborhood: z.optional(z.string()),
    locality: z.optional(z.string()),
    district: z.optional(z.string()), // US county
    city: z.optional(z.string()), // Mapbox calls this "place"
    postcode: z.optional(z.string()),
    region: z.optional(z.object({ // US state
      code: z.string(), // e.g. MI
      name: z.string(), // e.g. Michigan
    })),
    countryCode: z.string(),

    coordinates: z.object({
      lat: z.number(),
      lon: z.number(),
    }),
  }),
  startsAt: z.string(), // Local time 0000-00-00T00:00
  endsAt: z.string(), // Local time 0000-00-00T00:00
  registrationClosesAt: z.string(),
  logoStorageId: z.preprocess((val) => val === '' ? undefined : val, z.string().optional().transform((val) => val as StorageId)),
  bannerStorageId: z.preprocess((val) => val === '' ? undefined : val, z.string().optional().transform((val) => val as StorageId)),

  // Competitor Config
  maxCompetitors: z.coerce.number().min(2, 'Tournaments require at least two competitors.'),
  competitorSize: z.coerce.number(),
  useNationalTeams: z.boolean(),
  requireRealNames: z.boolean(),
  competitorFee: z.object({
    amount: z.coerce.number().min(0),
    currency: z.string().transform((val) => val as CurrencyCode),
  }),

  // Format Config
  roundCount: z.coerce.number(),
  roundStructure: z.object({
    pairingTime: z.coerce.number().min(0).max(30),
    setUpTime: z.coerce.number().min(0).max(30),
    playingTime: z.coerce.number().min(0).max(240),
  }),
  pairingMethod: z.string().transform((val) => val as TournamentPairingMethod),
  rankingFactors: z.array(z.string().transform((val) => val as RankingFactor)),

  // Game Config
  gameSystemConfig: fowV4GameSystemConfigFormSchema,

  // Non-editable
  gameSystem: z.string().transform((val) => val as GameSystem),
  organizerUserIds: z.array(z.string().transform((val) => val as UserId)),
}).refine((data) => {
  if (data.gameSystem === GameSystem.FlamesOfWarV4) {
    return fowV4GameSystemConfigFormSchema.safeParse(data.gameSystemConfig).success;
  }
  return false; // Return false if no valid game_system_id matches
}, {
  message: 'Invalid config for the selected game system.',
  path: ['gameSystemConfig'], // Highlight the game_system_config field in case of error
});

export const tournamentFormResolver = zodResolver(tournamentFormSchema);

export type TournamentFormData = z.infer<typeof tournamentFormSchema>;

export const defaultValues: DeepPartial<TournamentFormData> = {
  maxCompetitors: 20,
  competitorSize: 1,
  useNationalTeams: false,
  requireRealNames: true,
  description: '',
  roundCount: 3,
  rulesPackUrl: '',
  pairingMethod: TournamentPairingMethod.Adjacent,
  title: '',
  organizerUserIds: [],
  gameSystem: GameSystem.FlamesOfWarV4,
  gameSystemConfig: fowV4GameSystemConfigDefaultValues,
  roundStructure: {
    pairingTime: 0,
    setUpTime: 30,
    playingTime: 120,
  },
  rankingFactors: [RankingFactor.TotalWins],
  logoStorageId: '',
  bannerStorageId: '',
  editionYear: 2025,
};
