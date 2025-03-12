import { Infer, v } from 'convex/values';

export const fowV4RankingFactor = v.union(
  v.literal('total_wins'),
  v.literal('total_points'),
  v.literal('total_units_destroyed'),
  v.literal('total_units_lost'),
  v.literal('avg_wins'),
  v.literal('avg_points'),
  v.literal('avg_units_destroyed'),
  v.literal('avg_units_lost'),
  v.literal('total_opponent_wins'),
  v.literal('total_opponent_points'),
  v.literal('total_opponent_units_destroyed'),
  v.literal('total_opponent_units_lost'),
  v.literal('avg_opponent_wins'),
  v.literal('avg_opponent_points'),
  v.literal('avg_opponent_units_destroyed'),
  v.literal('avg_opponent_units_lost'),
);

export type FowV4RankingFactor = Infer<typeof fowV4RankingFactor>;
