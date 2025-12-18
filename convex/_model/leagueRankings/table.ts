import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { rankingFactorValues } from '../common/rankingFactor';

export const editableFields = {
  leagueId: v.id('leagues'),
  rank: v.number(),
  rankingFactors: rankingFactorValues,
  tournamentCount: v.number(),
  userId: v.id('users'),
};

export const leagueRankingInput = v.object({ ...editableFields });

/**
 * Fields which can only be edited using special mutations, or which are set programmatically.
 */
export const computedFields = {
  modifiedAt: v.optional(v.number()),
};

export default defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_league', ['leagueId', 'rank'])
  .index('by_league_user', ['leagueId', 'userId', 'rank'])
  .index('by_user', ['userId']);
