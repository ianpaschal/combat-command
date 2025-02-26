import { defineTable } from 'convex/server';
import { v } from 'convex/values';

const fields = {
  teamName: v.optional(v.string()),
  players: v.array(v.object({
    userId: v.id('users'),
    active: v.boolean(),
  })),
};

const table = defineTable({
  ...fields,

  // Linked fields:
  tournamentId: v.id('tournaments'),

  // Semi-system fields:
  modifiedAt: v.optional(v.number()),
}).index(
  'by_tournament_id', ['tournamentId'],
);

export {
  fields as tournamentCompetitorFields,
  table as tournamentCompetitors,
};
