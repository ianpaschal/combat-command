import { CurrencyCode } from '../../../static/currencyCodes';
import { FowV4RankingFactor } from '../../../static/fowV4/fowV4RankingFactors';
import { TournamentPairingMethod } from '../../../static/tournamentPairingMethods';

export const mockTournamentData = {
  title: 'Test Tournament',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a elit vehicula, vehicula tortor vitae, varius mauris. Ut varius erat a eros venenatis auctor. Donec erat turpis, pulvinar a eleifend et, consequat vel enim. Etiam vehicula risus eu hendrerit lacinia. Duis rhoncus vehicula justo ut vehicula.',
  // logoStorageId: v.optional(v.union(v.id('_storage'), v.null())),
  // bannerStorageId: v.optional(v.union(v.id('_storage'), v.null())),
  location: {
    timeZone: '',
    name: '',
    placeFormatted: '',
    coordinates: {
      lat: 0,
      lon: 0,
    },
    countryCode: 'nl',
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
    eraId: 'flames_of_war_v4::era::late_war',
    lessonsFromTheFrontVersionId: 'flames_of_war_v4::lessons_from_the_front_version::2024_03' as const,
    missionPackId: 'flames_of_war_v4::mission_pack::2023_04' as const,
    missionMatrixId: 'flames_of_war_v4::mission_matrix::2023_04_extended' as const,
  },
  gameSystemId: 'flames_of_war_v4' as const,
  competitorFee: {
    amount: 1000,
    currency: 'eur' as CurrencyCode,
  },
  roundCount: 5,
  pairingMethod: 'adjacent' as TournamentPairingMethod,
  rankingFactors: ['total_wins', 'total_points', 'total_units_destroyed'] as FowV4RankingFactor[],
};
