import { GameSystem } from '@ianpaschal/combat-command-game-systems/common';
import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { getStaticEnumConvexValidator } from '../common/_helpers/getStaticEnumConvexValidator';
import { FlamesOfWarV4 } from './gameSystems';

const gameSystem = getStaticEnumConvexValidator(GameSystem);

export const editableFields = {
  data: FlamesOfWarV4.listData, // TODO: Union with other types
  gameSystem,
  storageId: v.optional(v.id('_storage')), // TODO: NOt optional after migration
  tournamentRegistrationId: v.id('tournamentRegistrations'),
};

/**
 * Fields which can only be edited using special mutations, or which are set programmatically.
 */
export const computedFields = {
  modifiedAt: v.optional(v.number()),
  locked: v.optional(v.boolean()),
  // approvalStatus: v.union(v.literal('approved'), v.literal('rejected'), v.null()),
  primary: v.optional(v.boolean()),

  ownerUserId: v.optional(v.id('users')), // Deprecated, remove with migration
};

export default defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_game_system', ['gameSystem'])
  .index('by_tournament_registration', ['tournamentRegistrationId']);
