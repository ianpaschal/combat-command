import { v } from 'convex/values';

export const editableFields = {
  teamName: v.optional(v.string()),
  tournamentId: v.id('tournaments'),
  players: v.array(v.object({
    userId: v.id('users'),
    active: v.boolean(),
  })),
};

export const computedFields = {
  modifiedAt: v.optional(v.number()),
};
