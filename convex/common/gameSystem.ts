import { Infer, v } from 'convex/values';

export const gameSystem = v.union(
  v.literal('flames_of_war_4th_edition'),
);

export type GameSystem = Infer<typeof gameSystem>;
