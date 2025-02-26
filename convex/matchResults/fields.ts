import { v } from 'convex/values';

import { fowV4GameSystemConfig } from '../common/fowV4GameSystemConfig';
import { fowV4MatchResultDetails } from '../common/fowV4MatchResultDetails';
import { gameSystem } from '../common/gameSystem';

export const matchResultFields = {
  player0UserId: v.id('users'),
  player1UserId: v.optional(v.id('users')),
  player1Placeholder: v.optional(v.string()),
  details: v.union(fowV4MatchResultDetails),
  // TODO: Comments
  // TODO: Photos
  // TODO: Kudos
  // TODO: Add tournament pairing ID

  // Denormalized so that we can filter tournaments by game system, and all related fields.
  // The duplicate data is worth the efficiency in querying.
  gameSystemConfig: v.union(fowV4GameSystemConfig),
  gameSystem,
};
