import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { alignment } from '../common/alignment';
import { faction } from '../common/faction';

export const detailFields = v.object({
  alignment: v.optional(alignment),
  faction: v.optional(faction),
});

export const editableFields = {
  userId: v.id('users'),
  tournamentId: v.id('tournaments'),
  tournamentCompetitorId: v.id('tournamentCompetitors'),
  details: v.optional(detailFields),
};

export default defineTable({
  userId: v.id('users'),
  tournamentId: v.id('tournaments'),
  tournamentCompetitorId: v.id('tournamentCompetitors'),
  details: v.optional(detailFields),
  active: v.optional(v.boolean()),
  confirmed: v.optional(v.boolean()),
  modifiedAt: v.optional(v.number()),

  // Deprecated fields:
  listId: v.optional(v.id('lists')),
  userConfirmed: v.optional(v.boolean()),
  listApproved: v.optional(v.boolean()),
})
  .index('by_tournament', ['tournamentId'])
  .index('by_tournament_user', ['tournamentId', 'userId'])
  .index('by_tournament_competitor', ['tournamentCompetitorId'])
  .index('by_tournament_competitor_user', ['tournamentCompetitorId', 'userId'])
  .index('by_user', ['userId']);
