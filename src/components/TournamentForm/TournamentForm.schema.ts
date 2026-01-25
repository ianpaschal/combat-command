import { zodResolver } from '@hookform/resolvers/zod';
import {
  CurrencyCode,
  GameSystem,
  TournamentPairingMethod,
} from '@ianpaschal/combat-command-game-systems/common';
import { RankingFactor } from '@ianpaschal/combat-command-game-systems/flamesOfWarV4';
import { z } from 'zod';

import { StorageId, TournamentEditableFields } from '~/api';
import {
  gameSystemConfig,
  getGameSystemConfigDefaultValues,
  validateGameSystemConfig,
} from '~/components/GameSystemConfigFields';

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

  startsAt: z.date(),
  endsAt: z.date(),
  registrationClosesAt: z.date(),
  listSubmissionClosesAt: z.date(),

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
  registrationDetails: z.optional(z.object({
    alignment: z.union([z.literal('optional'), z.literal('required'), z.null()]),
    faction: z.union([z.literal('optional'), z.literal('required'), z.null()]),
  })),

  alignmentsRevealed: z.boolean(),
  factionsRevealed: z.boolean(),

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
  gameSystem: z.string().transform((val) => val as GameSystem),
  gameSystemConfig,
}).refine(validateGameSystemConfig, {
  message: 'Invalid config for the selected game system.',
  path: ['gameSystemConfig'], // Highlight the game_system_config field in case of error
}).superRefine((data, ctx) => {
  if (data.pairingMethod === TournamentPairingMethod.AdjacentAlignment && data.competitorSize > 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Adjacent alignment (red vs. blue) pairing is not available for team competitions.',
      path: ['pairingMethod'],
    });
  }
});

export const tournamentFormResolver = zodResolver(tournamentFormSchema);

export type TournamentSubmitData = TournamentEditableFields;

export type TournamentFormData = z.infer<typeof tournamentFormSchema>;

export const defaultValues: Omit<z.infer<typeof tournamentFormSchema>, 'location'> = {
  maxCompetitors: 20,
  competitorSize: 1,
  useNationalTeams: false,
  requireRealNames: true,
  description: '',
  roundCount: 3,
  rulesPackUrl: '',
  pairingMethod: TournamentPairingMethod.Adjacent,
  title: '',
  gameSystem: GameSystem.FlamesOfWarV4,
  gameSystemConfig: getGameSystemConfigDefaultValues(GameSystem.FlamesOfWarV4),
  roundStructure: {
    pairingTime: 0,
    setUpTime: 30,
    playingTime: 120,
  },
  competitorFee: {
    currency: CurrencyCode.EUR,
    amount: 0,
  },
  rankingFactors: ['total_wins'],
  logoStorageId: '' as StorageId,
  bannerStorageId: '' as StorageId,
  editionYear: new Date().getFullYear(),
  alignmentsRevealed: true,
  factionsRevealed: false,
  registrationDetails: {
    alignment: 'optional',
    faction: null,
  },
  startsAt: (() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    date.setHours(9, 0, 0, 0);
    return date;
  })(),
  endsAt: (() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    date.setHours(17, 0, 0, 0);
    return date;
  })(),
  registrationClosesAt: (() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    date.setHours(23, 0, 0, 0);
    return date;
  })(),
  listSubmissionClosesAt: (() => {
    const date = new Date();
    date.setDate(date.getDate() + 10);
    date.setHours(23, 0, 0, 0);
    return date;
  })(),
};
