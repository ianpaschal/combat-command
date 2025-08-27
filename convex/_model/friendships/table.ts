import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const editableFields = {
  senderUserId: v.id('users'),
  recipientUserId: v.id('users'),
};

export default defineTable({
  ...editableFields,
  confirmedAt: v.optional(v.number()),
})
  .index('by_sender_user_id', ['senderUserId', 'confirmedAt'])
  .index('by_recipient_user_id', ['recipientUserId', 'confirmedAt'])
  .index('by_confirmation', ['confirmedAt']);
