import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { friendshipFields } from './friendships/fields';
import { matchResultFields } from './matchResults/fields';
import { tournamentPairingFields } from './tournamentPairings/fields';
import { tournamentFields } from './tournaments/fields';
import { userFields } from './users/fields';

export const friendships = defineTable({
  ...friendshipFields,
  confirmedAt: v.optional(v.number()),
}).index(
  'by_sender_user_id', ['senderUserId', 'confirmedAt'],
).index(
  'by_recipient_user_id', ['recipientUserId', 'confirmedAt'],
).index(
  'by_confirmation', ['confirmedAt'],
);

export const matchResults = defineTable({
  ...matchResultFields,
  confirmedAt: v.optional(v.number()),
  modifiedAt: v.optional(v.number()),
}).index(
  'by_user_id', ['player0UserId', 'player1UserId'],
).index(
  'by_game_system', ['gameSystem'],
);

export const tournamentPairings = defineTable({
  ...tournamentPairingFields,
  tournamentId: v.id('tournaments'),
  modifiedAt: v.optional(v.number()),
}).index(
  'by_tournament_id', ['tournamentId'],
);

export const tournaments = defineTable({
  ...tournamentFields,
  modifiedAt: v.optional(v.number()),
}).index(
  'by_game_system', ['gameSystem'],
);

export const users = defineTable({
  ...userFields,
  email: v.string(),
  modifiedAt: v.optional(v.number()),
}).index(
  'by_country_code', ['countryCode'],
).index(
  'by_name', ['givenName', 'familyName'],
).index(
  'by_username', ['username'],
);
