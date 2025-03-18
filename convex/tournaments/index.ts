import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { fowV4GameSystemConfig } from '../common/fowV4/fowV4GameSystemConfig';
import { fowV4RankingFactor } from '../common/fowV4/fowV4RankingFactor';
import { tournamentPairingMethod } from '../common/tournamentPairingMethod';
import { tournamentStatus } from '../common/tournamentStatus';
import { gameSystemId } from '../static/gameSystems';

export const fields = {

  // TODO: Add competitor groups
  bannerUrl: v.optional(v.string()),
  competitorCount: v.number(),
  competitorSize: v.number(),
  currentRound: v.optional(v.number()),
  description: v.string(),
  endsAt: v.string(), // ISO date string
  // Denormalized so that we can filter tournaments by game system, and all related fields.
  // The duplicate data is worth the efficiency in querying.
  gameSystemConfig: v.union(fowV4GameSystemConfig),
  gameSystem: v.optional(gameSystemId),
  gameSystemId: v.optional(gameSystemId),
  location: v.object({
    placeId: v.string(), // Mapbox Place ID,
    lat: v.number(),
    lon: v.number(),
  }),
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

};

export const table = defineTable({
  ...fields,
  modifiedAt: v.optional(v.number()),
}).index(
  'by_game_system', ['gameSystem'],
).index(
  'by_game_system_id', ['gameSystemId'],
);

export {
  fields as tournamentFields,
  table as tournaments,
};
