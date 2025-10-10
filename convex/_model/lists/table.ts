import { GameSystem } from '@ianpaschal/combat-command-game-systems/common';
import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { getStaticEnumConvexValidator } from '../common/_helpers/getStaticEnumConvexValidator';
import { FlamesOfWarV4 } from '../gameSystems';

const gameSystem = getStaticEnumConvexValidator(GameSystem);

export const editableFields = {
  gameSystem: gameSystem,
  data: FlamesOfWarV4.listData,
  ownerUserId: v.id('users'),
};

/**
 * Fields which can only be edited using special mutations, or which are set programmatically.
 */
export const computedFields = {
  modifiedAt: v.optional(v.number()),
  locked: v.optional(v.boolean()),
};

export default defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_owner_user_id', ['ownerUserId']);
