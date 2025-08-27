import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const fields = {
  storageId: v.id('_storage'),
};

export default defineTable({
  ...fields,
  ownerUserId: v.id('users'),
}).index(
  'by_owner_user_id', ['ownerUserId'],
);
