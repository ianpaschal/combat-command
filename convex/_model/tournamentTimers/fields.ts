import { v } from 'convex/values';

export const fields = {
  tournamentId: v.id('tournaments'),
  round: v.number(),
  startedAt: v.number(),
  pausedAt: v.union(v.null(), v.number()),
  pauseTime: v.number(),
};
