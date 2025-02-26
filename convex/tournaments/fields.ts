import { v } from 'convex/values';

import { fowV4GameSystemConfig } from '../common/fowV4GameSystemConfig';
import { fowV4RankingFactor } from '../common/fowV4RankingFactor';
import { gameSystem } from '../common/gameSystem';
import { tournamentPairingMethod } from '../common/tournamentPairingMethod';
import { tournamentStatus } from '../common/tournamentStatus';

export const tournamentFields = {
  // TODO: Add competitor groups
  bannerUrl: v.optional(v.string()),
  competitorCount: v.number(),
  competitorSize: v.number(),
  currentRound: v.optional(v.number()),
  description: v.string(),
  endsAt: v.string(), // ISO date string
  location: v.string(), // Mapbox Place ID
  organizerIds: v.array(v.id('users')),
  pairingMethod: tournamentPairingMethod,
  rankingFactors: v.array(fowV4RankingFactor),
  registrationClosesAt: v.string(), // ISO date string
  requireRealNames: v.boolean(),
  roundCount: v.number(),
  rulesPackUrl: v.optional(v.string()),
  startsAt: v.string(), // ISO date string
  status: tournamentStatus,
  title: v.string(),
  useNationalTeams: v.boolean(),

  // Denormalized so that we can filter tournaments by game system, and all related fields.
  // The duplicate data is worth the efficiency in querying.
  gameSystemConfig: v.union(fowV4GameSystemConfig),
  gameSystem,
};
