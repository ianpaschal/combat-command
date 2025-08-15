import { GameSystem } from '@ianpaschal/combat-command-static-data/common';
import { v } from 'convex/values';

import { getStaticEnumConvexValidator } from '../common/_helpers/getStaticEnumConvexValidator';
import { fowV4GameSystemConfig } from '../fowV4/fowV4GameSystemConfig';
import { fowV4MatchResultDetails } from '../fowV4/fowV4MatchResultDetails';

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
  details: v.union(fowV4MatchResultDetails),

  // Game System
  gameSystemConfig: v.union(fowV4GameSystemConfig),
  gameSystemId: v.optional(gameSystem), // TODO: REMOVE AFTER MIGRATION
  gameSystem: v.optional(gameSystem),

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
