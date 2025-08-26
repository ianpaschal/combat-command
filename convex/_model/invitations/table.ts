import { defineTable } from 'convex/server';

import { computedFields, editableFields } from './fields';

export const invitationsTable = defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_secret', ['secret'])
  .index('by_email', ['email'])
  .index('by_invitedUser', ['invitedUserId']);
