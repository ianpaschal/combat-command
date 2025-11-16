import { GameSystem } from '@ianpaschal/combat-command-game-systems/common';
import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { getStaticEnumConvexValidator } from '../common/_helpers/getStaticEnumConvexValidator';
import { FlamesOfWarV4 } from '../gameSystems';

const gameSystem = getStaticEnumConvexValidator(GameSystem);

export const editableFields = {
  data: FlamesOfWarV4.listData, // TODO: Union with other types
  gameSystem: gameSystem,
  storageId: v.optional(v.id('_storage')), // TODO: Make required
  tournamentRegistrationId: v.optional(v.id('tournamentRegistrations')), // TODO: Make required
};

/**
 * Fields which can only be edited using special mutations, or which are set programmatically.
 */
export const computedFields = {
  modifiedAt: v.optional(v.number()),
  locked: v.optional(v.boolean()),
  approvalStatus: v.optional(v.union(v.literal('approved'), v.literal('rejected'), v.null())), // TODO: Make required
  approvalNotes: v.optional(v.string()),
  primary: v.optional(v.boolean()), // TODO: Make required

  // Deprecated
  ownerUserId: v.optional(v.id('users')),
};

export default defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_game_system', ['gameSystem'])
  .index('by_tournament_registration', ['tournamentRegistrationId']);
