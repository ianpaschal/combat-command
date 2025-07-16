import { v } from 'convex/values';

import { gameSystemId } from '../../static/gameSystems';
import { fowV4GameSystemConfig } from '../fowV4/fowV4GameSystemConfig';
import { fowV4MatchResultDetails } from '../fowV4/fowV4MatchResultDetails';

export const editableFields = {
  // Tournament
  tournamentPairingId: v.optional(v.id('tournamentPairings')),
  // Denormalized so that we can filter match results by tournament.
  // The duplicate data is worth the efficiency in querying.
  // Calculated from tournamentPairingId.
  tournamentId: v.optional(v.id('tournaments')),

  // Players
  player0UserId: v.optional(v.id('users')),
  player0Placeholder: v.optional(v.string()),
  player1UserId: v.optional(v.id('users')),
  player1Placeholder: v.optional(v.string()),

  // General
  playedAt: v.union(v.string(), v.number()),
  details: v.union(fowV4MatchResultDetails),

  // Game System
  gameSystemConfig: v.union(fowV4GameSystemConfig),
  gameSystemId: gameSystemId,

  photoIds: v.optional(v.array(v.id('photos'))),
};

export const computedFields = {
  player0Confirmed: v.optional(v.boolean()),
  player1Confirmed: v.optional(v.boolean()),
  modifiedAt: v.optional(v.number()),
};
