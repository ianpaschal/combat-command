import {
  CurrencyCode,
  GameSystem,
  TournamentPairingMethod,
} from '@ianpaschal/combat-command-static-data/common';
import { RankingFactor } from '@ianpaschal/combat-command-static-data/flamesOfWarV4';
import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { getStaticEnumConvexValidator } from '../common/_helpers/getStaticEnumConvexValidator';
import { location } from '../common/location';
import { tournamentStatus } from '../common/tournamentStatus';
import { fowV4GameSystemConfig } from '../fowV4/fowV4GameSystemConfig';

const currencyCode = getStaticEnumConvexValidator(CurrencyCode);
const gameSystem = getStaticEnumConvexValidator(GameSystem);
const tournamentPairingMethod = getStaticEnumConvexValidator(TournamentPairingMethod);
const rankingFactor = getStaticEnumConvexValidator(RankingFactor);

export const editableFields = {

  // Practical (in approximate UI order)
  title: v.string(),
  description: v.string(),
  logoStorageId: v.optional(v.union(v.id('_storage'))),
  logoWrapper: v.optional(v.object({
    shape: v.union(v.literal('round'), v.literal('hexagon'), v.literal('shield'), v.literal('square')),
    borderColor: v.optional(v.string()),
    backgroundColor: v.string(),
  })),
  bannerStorageId: v.optional(v.union(v.id('_storage'))),
  location,

  startsAt: v.union(v.number(), v.string()),
  endsAt: v.union(v.number(), v.string()),
  registrationClosesAt: v.union(v.number(), v.string()),
  listSubmissionClosesAt: v.union(v.number(), v.string()),

  requireRealNames: v.boolean(),
  organizerUserIds: v.optional(v.array(v.id('users'))),
  rulesPackUrl: v.optional(v.string()),
  editionYear: v.optional(v.number()),

  // Denormalized so that we can filter tournaments by game system, and all related fields.
  // The duplicate data is worth the efficiency in querying.
  gameSystemConfig: v.union(fowV4GameSystemConfig),
  gameSystemId: v.optional(gameSystem),
  gameSystem: v.optional(gameSystem),
  
  // Competitors
  maxCompetitors: v.number(),
  competitorSize: v.number(),
  competitorFee: v.optional(v.object({
    amount: v.number(),
    currency: currencyCode,
  })),
  useNationalTeams: v.boolean(),

  // Format
  roundCount: v.number(),
  roundStructure: v.object({
    pairingTime: v.number(), // Should always be 0 for non team tournaments
    setUpTime: v.number(),
    playingTime: v.number(),
  }),

  pairingMethod: tournamentPairingMethod,
  rankingFactors: v.array(v.union(rankingFactor)),
};

export const computedFields = {
  currentRound: v.optional(v.number()),
  lastRound: v.optional(v.number()),
  status: tournamentStatus,
  modifiedAt: v.optional(v.number()),
};

export default defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_game_system_id', ['gameSystemId'])
  .index('by_starts_at', ['startsAt'])
  .index('by_status_starts_at', ['status', 'startsAt'])
  .index('by_status', ['status']);
