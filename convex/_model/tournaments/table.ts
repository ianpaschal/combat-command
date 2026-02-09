import {
  CurrencyCode,
  GameSystem,
  TournamentPairingMethod,
} from '@ianpaschal/combat-command-game-systems/common';
import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { getStaticEnumConvexValidator } from '../common/_helpers/getStaticEnumConvexValidator';
import { gameSystemConfig } from '../common/gameSystemConfig';
import { location } from '../common/location';
import { rankingFactor } from '../common/rankingFactor';
import { tournamentPairingConfig } from '../common/tournamentPairingConfig';
import { tournamentStatus } from '../common/tournamentStatus';

const currencyCode = getStaticEnumConvexValidator(CurrencyCode);
const gameSystem = getStaticEnumConvexValidator(GameSystem);
const tournamentPairingMethod = getStaticEnumConvexValidator(TournamentPairingMethod);

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
  leagueId: v.optional(v.id('leagues')),

  startsAt: v.number(),
  endsAt: v.number(),
  registrationClosesAt: v.number(),
  listSubmissionClosesAt: v.number(),

  rulesPackUrl: v.optional(v.string()),
  editionYear: v.optional(v.number()),

  // Denormalized so that we can filter tournaments by game system, and all related fields.
  // The duplicate data is worth the efficiency in querying.
  // TODO: Keep all game-system-specific attributes in one object for easy validation
  gameSystem,
  gameSystemConfig,
  rankingFactors: v.array(rankingFactor),
  
  // Competitors
  maxCompetitors: v.number(),
  competitorSize: v.number(),
  competitorFee: v.optional(v.object({
    amount: v.number(),
    currency: currencyCode,
  })),
  useNationalTeams: v.boolean(),

  // Registrations
  requireRealNames: v.boolean(),
  registrationDetails: v.optional(v.object({
    alignment: v.union(v.literal('optional'), v.literal('required'), v.null()),
    faction: v.union(v.literal('optional'), v.literal('required'), v.null()),
  })),

  alignmentsRevealed: v.optional(v.boolean()),
  factionsRevealed: v.optional(v.boolean()),

  // Format
  pairingConfig: v.optional(tournamentPairingConfig), // TODO: Remove optional after migration
  pairingMethod: v.optional(tournamentPairingMethod), // TODO: Remove optional after migration
  roundCount: v.number(),
  roundStructure: v.object({
    pairingTime: v.number(), // Should always be 0 for non team tournaments
    setUpTime: v.number(),
    playingTime: v.number(),
  }),
};

export const computedFields = {
  currentRound: v.optional(v.number()),
  lastRound: v.optional(v.number()),
  status: tournamentStatus,
  modifiedAt: v.optional(v.number()),
  startsAtTaskId: v.optional(v.id('_scheduled_functions')),
  endsAtTaskId: v.optional(v.id('_scheduled_functions')),
  search: v.optional(v.string()),
};

export default defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_game_system_starts_at', ['gameSystem', 'startsAt'])
  .index('by_game_system', ['gameSystem'])
  .index('by_starts_at', ['startsAt'])
  .index('by_league', ['leagueId'])
  .index('by_status_starts_at', ['status', 'startsAt'])
  .index('by_status', ['status'])
  .searchIndex('search', { searchField: 'search' });
