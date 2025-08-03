import { v } from 'convex/values';

import { gameSystemId } from '../../static/gameSystems';
import { fowV4ListData } from '../fowV4/fowV4ListData';

export const editableFields = {
  gameSystemId: gameSystemId,
  data: fowV4ListData,
  ownerUserId: v.id('users'),
};

/**
 * Fields which can only be edited using special mutations, or which are set programmatically.
 */
export const computedFields = {
  modifiedAt: v.optional(v.number()),
  locked: v.optional(v.boolean()),
};
