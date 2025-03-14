import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const fields = {
  senderUserId: v.id('users'),
  recipientUserId: v.id('users'),
};

const table = defineTable({
  ...fields,
  confirmedAt: v.optional(v.number()),
}).index(
  'by_sender_user_id', ['senderUserId', 'confirmedAt'],
).index(
  'by_recipient_user_id', ['recipientUserId', 'confirmedAt'],
).index(
  'by_confirmation', ['confirmedAt'],
);

export {
  fields as friendshipFields,
  table as friendships,
};
