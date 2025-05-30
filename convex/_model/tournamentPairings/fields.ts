import { v } from 'convex/values';

export const uniqueFields = {
  table: v.union(v.number(), v.null()),
  tournamentCompetitor0Id: v.id('tournamentCompetitors'),
  tournamentCompetitor1Id: v.union(v.id('tournamentCompetitors'), v.null()),
};

export const sharedFields = {
  round: v.number(),
  tournamentId: v.id('tournaments'),
};

export const editableFields = {
  ...sharedFields,
  ...uniqueFields,
};

export const computedFields = {
  modifiedAt: v.optional(v.number()),
};
