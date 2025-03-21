import { v } from 'convex/values';

export const editableFields = {
  round: v.number(),
  table: v.number(),
  tournamentCompetitor0Id: v.id('tournamentCompetitors'),
  tournamentCompetitor1Id: v.id('tournamentCompetitors'),
  tournamentId: v.id('tournaments'),
};

export const computedFields = {
  modifiedAt: v.optional(v.number()),
};
