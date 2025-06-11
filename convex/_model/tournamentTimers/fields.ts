import { v } from 'convex/values';

export const editableFields = {
  tournamentId: v.id('tournaments'),
  round: v.number(),
};

export const computedFields = {
  startedAt: v.union(v.null(), v.number()),
  pausedAt: v.union(v.null(), v.number()),
  pauseTime: v.number(),
};

export const fields = {
  ...editableFields,
  ...computedFields,
};
