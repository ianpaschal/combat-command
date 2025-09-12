import { RankingFactor as FowV4RankingFactor } from '@ianpaschal/combat-command-static-data/flamesOfWarV4';
import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { getStaticEnumConvexValidator } from '../common/_helpers/getStaticEnumConvexValidator';

const fowV4RankingFactor = getStaticEnumConvexValidator(FowV4RankingFactor);

export const editableFields = {
  tournamentId: v.id('tournaments'),
  teamName: v.optional(v.string()),
  captainUserId: v.optional(v.id('users')),
  scoreAdjustments: v.optional(v.array(v.object({
    amount: v.number(),
    round: v.number(),
    rankingFactor: v.union(fowV4RankingFactor),
    reason: v.optional(v.string()),
  }))),
};

/**
 * Fields which can only be edited using special mutations, or which are set programmatically.
 */
export const computedFields = {
  active: v.optional(v.boolean()),
  modifiedAt: v.optional(v.number()),
};

export default defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_tournament_id', ['tournamentId']);
