import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { fowV4GameSystemConfig } from '../common/fowV4/fowV4GameSystemConfig';
import { fowV4MatchResultDetails } from '../common/fowV4/fowV4MatchResultDetails';
import { gameSystemId } from '../static/gameSystems';

export const fields = {
  tournamentPairingId: v.optional(v.id('tournamentPairings')),

  // Players
  player0UserId: v.optional(v.id('users')),
  player0Placeholder: v.optional(v.string()),
  player1UserId: v.optional(v.id('users')),
  player1Placeholder: v.optional(v.string()),

  // General
  playedAt: v.string(),
  details: v.union(fowV4MatchResultDetails),

  // Game System
  // Denormalized so that we can filter tournaments by game system, and all related fields.
  // The duplicate data is worth the efficiency in querying.
  gameSystemConfig: v.union(fowV4GameSystemConfig),
  gameSystem: v.optional(gameSystemId),
  gameSystemId: v.optional(gameSystemId),

  photoIds: v.optional(v.array(v.id('photos'))),
};

const table = defineTable({
  ...fields,
  player0Confirmed: v.boolean(),
  player1Confirmed: v.boolean(),
  modifiedAt: v.optional(v.number()),
}).index(
  'by_user_id', ['player0UserId', 'player1UserId'],
).index(
  'by_game_system', ['gameSystem'],
).index(
  'by_game_system_id', ['gameSystemId'],
);

export {
  fields as matchResultFields,
  table as matchResults,
};
