import {
  CurrencyCode,
  GameSystem,
  getGameSystem,
  TournamentPairingMethod,
} from '@ianpaschal/combat-command-game-systems/common';

import { Doc } from '../_generated/dataModel';
import { RankingFactor } from '../_model/common/types';

const DAY_LENGTH_MS = 172800000;

const location = {
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
};

type TournamentData = Omit<Doc<'tournaments'>, '_id'|'_creationTime'>;

export const createMockTournament = (
  gameSystem: GameSystem,
  overrides: Partial<TournamentData>,
): TournamentData => {
  const { gameSystemConfig } = getGameSystem(gameSystem);
  return {
    gameSystem,
    title: 'Test Tournament',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a elit vehicula, vehicula tortor vitae, varius mauris. Ut varius erat a eros venenatis auctor. Donec erat turpis, pulvinar a eleifend et, consequat vel enim. Etiam vehicula risus eu hendrerit lacinia. Duis rhoncus vehicula justo ut vehicula.',
    // logoStorageId: v.optional(v.union(v.id('_storage'), v.null())),
    // bannerStorageId: v.optional(v.union(v.id('_storage'), v.null())),
    location,
    requireRealNames: false,
    rulesPackUrl: 'https://www.combatcommand.net',
    competitorFee: {
      amount: 1000,
      currency: CurrencyCode.EUR,
    },
    roundCount: 5,
    pairingMethod: TournamentPairingMethod.Adjacent,
    gameSystemConfig: gameSystemConfig.defaultValues,
    startsAt: Date.now() + (DAY_LENGTH_MS * 3),
    endsAt: Date.now() + (DAY_LENGTH_MS * 5),
    registrationClosesAt: Date.now() + (DAY_LENGTH_MS * 1),
    listSubmissionClosesAt: Date.now() + (DAY_LENGTH_MS * 2),
    maxCompetitors: 48,
    competitorSize: 1,
    useNationalTeams: false,
    roundStructure: {
      pairingTime: 0,
      setUpTime: 2,
      playingTime: 3,
    },
    status: 'draft',
    rankingFactors: [
      'total_wins',
      'total_points',
      'total_units_destroyed',
    ] as RankingFactor[],
    ...overrides,
  };
};
