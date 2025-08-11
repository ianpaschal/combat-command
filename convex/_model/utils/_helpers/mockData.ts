import {
  CurrencyCode,
  GameSystem,
  TournamentPairingMethod,
} from '@ianpaschal/combat-command-static-data/common';
import {
  Era,
  LessonsFromTheFrontVersion,
  MissionPackVersion,
  RankingFactor,
} from '@ianpaschal/combat-command-static-data/flamesOfWarV4';

export const mockTournamentData = {
  title: 'Test Tournament',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a elit vehicula, vehicula tortor vitae, varius mauris. Ut varius erat a eros venenatis auctor. Donec erat turpis, pulvinar a eleifend et, consequat vel enim. Etiam vehicula risus eu hendrerit lacinia. Duis rhoncus vehicula justo ut vehicula.',
  // logoStorageId: v.optional(v.union(v.id('_storage'), v.null())),
  // bannerStorageId: v.optional(v.union(v.id('_storage'), v.null())),
  location: {
    address: '',
    city: 'Ann Arbor',
    coordinates: { lat: 42.27859, lon: -83.739716 },
    countryCode: 'us',
    district: 'Washtenaw County',
    mapboxId: 'dXJuOm1ieHBsYzpKOTFNN0E',
    name: 'University of Michigan',
    placeFormatted: 'Ann Arbor, Michigan, United States',
    postcode: '48109',
    region: { code: 'mi', name: 'Michigan' },
    timeZone: 'America/Detroit',
  },
  startsAt: '2025-06-21T09:00:00',
  endsAt:'2025-06-22T18:00:00',
  registrationClosesAt: '2025-06-14T00:00:00',
  requireRealNames: false,
  rulesPackUrl: 'https://www.combatcommand.net',
  gameSystemConfig: {
    // additionalRules: v.optional(v.object({
    //   allowMidWarMonsters: v.optional(v.union(v.literal('yes'), v.literal('combat'), v.literal('no'))),
    // })),
    // dynamicPointsVersionId: v.optional(fowV4DynamicPointsVersionId),
    points: 100,
    era: Era.LW,
    lessonsFromTheFrontVersion: LessonsFromTheFrontVersion.Mar2024,
    missionPackVersion: MissionPackVersion.Apr2023,
    missionMatrix: 'extended' as const,
  },
  gameSystem: GameSystem.FlamesOfWarV4,
  competitorFee: {
    amount: 1000,
    currency: CurrencyCode.EUR,
  },
  roundCount: 5,
  pairingMethod: TournamentPairingMethod.Adjacent,
  rankingFactors: [
    RankingFactor.TotalWins,
    RankingFactor.TotalPoints,
    RankingFactor.TotalUnitsDestroyed,
  ],
};
