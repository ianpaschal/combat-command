import { v } from 'convex/values';

import { fowV4GameSystemConfig } from '../../common/fowV4/fowV4GameSystemConfig';
import { location } from '../../common/location';
import { tournamentStatus } from '../../common/tournamentStatus';
import { currencyCode } from '../../static/currencyCodes';
import { fowV4RankingFactor } from '../../static/fowV4/fowV4RankingFactors';
import { gameSystemId } from '../../static/gameSystems';
import { tournamentPairingMethod } from '../../static/tournamentPairingMethods';

export const editableFields = {

  // Practical (in approximate UI order)
  title: v.string(),
  description: v.string(),
  logoStorageId: v.optional(v.union(v.id('_storage'), v.null())),
  bannerStorageId: v.optional(v.union(v.id('_storage'), v.null())),
  location,
  startsAt: v.string(), // ISO date string
  endsAt: v.string(), // ISO date string
  registrationClosesAt: v.string(), // ISO date string
  requireRealNames: v.boolean(),
  organizerUserIds: v.array(v.id('users')),
  rulesPackUrl: v.optional(v.string()),

  // Denormalized so that we can filter tournaments by game system, and all related fields.
  // The duplicate data is worth the efficiency in querying.
  gameSystemConfig: v.union(fowV4GameSystemConfig),
  gameSystemId: gameSystemId,
  
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
  rankingFactors: v.array(v.union(fowV4RankingFactor)),
};

export const computedFields = {
  currentRound: v.optional(v.number()),
  lastRound: v.optional(v.number()),
  status: tournamentStatus,
  modifiedAt: v.optional(v.number()),
};
