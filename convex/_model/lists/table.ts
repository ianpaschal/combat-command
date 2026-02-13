import { GameSystem } from '@ianpaschal/combat-command-game-systems/common';
import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { getStaticEnumConvexValidator } from '../common/_helpers/getStaticEnumConvexValidator';

const gameSystem = getStaticEnumConvexValidator(GameSystem);

export const editableFields = {
  gameSystem,
  storageId: v.id('_storage'),
  userId: v.id('users'),
  tournamentRegistrationId: v.optional(v.id('tournamentRegistrations')),

  // FUTURE:
  // data: listData,
};

/**
 * Fields which can only be edited using special mutations, or which are set programmatically.
 */
export const computedFields = {
  modifiedAt: v.optional(v.number()),
  locked: v.boolean(),
  approved: v.boolean(),
};

export default defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_game_system', ['gameSystem'])
  .index('by_tournament_registration', ['tournamentRegistrationId'])
  .index('by_user', ['userId']);
