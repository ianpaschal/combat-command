import { GameSystem } from '@ianpaschal/combat-command-game-systems/common';
import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { getStaticEnumConvexValidator } from '../common/_helpers/getStaticEnumConvexValidator';
import { gameSystemConfig } from '../common/gameSystemConfig';
import { matchResultDetails } from '../common/matchResultDetails';

const gameSystem = getStaticEnumConvexValidator(GameSystem);

export const editableFields = {
  tournamentPairingId: v.optional(v.id('tournamentPairings')),

  // Players
  player0UserId: v.optional(v.id('users')),
  player0Placeholder: v.optional(v.string()),
  player0ListId: v.optional(v.id('lists')),
  player1UserId: v.optional(v.id('users')),
  player1Placeholder: v.optional(v.string()),
  player1ListId: v.optional(v.id('lists')),

  // General
  playedAt: v.union(v.string(), v.number()),
  details: matchResultDetails,

  // Denormalized so that we can filter tournaments by game system, and all related fields.
  // The duplicate data is worth the efficiency in querying.
  // TODO: Keep all game-system-specific attributes in one object for easy validation
  gameSystem,
  gameSystemConfig,

  photoIds: v.optional(v.array(v.id('photos'))),
};

export const computedFields = {
  // Denormalized so that we can filter match results by tournament.
  // The duplicate data is worth the efficiency in querying.
  // Calculated from tournamentPairingId.
  tournamentId: v.optional(v.id('tournaments')),
  player0Confirmed: v.optional(v.boolean()),
  player1Confirmed: v.optional(v.boolean()),
  modifiedAt: v.optional(v.number()),
};

export default defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_game_system', ['gameSystem'])
  .index('by_tournament_id', ['tournamentId'])
  .index('by_tournament_pairing_id', ['tournamentPairingId'])
  .index('by_user_id', ['player0UserId', 'player1UserId']);
