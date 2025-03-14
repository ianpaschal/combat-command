import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const fields = {
  tournamentCompetitor0Id: v.id('tournamentCompetitors'),
  tournamentCompetitor1Id: v.id('tournamentCompetitors'),
  round: v.number(),
  table: v.number(),
};

export const table = defineTable({
  ...fields,
  tournamentId: v.id('tournaments'),
  modifiedAt: v.optional(v.number()),
}).index(
  'by_tournament_id', ['tournamentId'],
);

export {
  fields as tournamentPairingFields,
  table as tournamentPairings,
};
