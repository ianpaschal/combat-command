import { z } from 'zod';

export const fowV4RankingFactorSchema = z.union([
  z.literal('total_wins'),
  z.literal('total_points'),
  z.literal('total_platoons_killed'),
  z.literal('total_platoons_lost'),
  z.literal('avg_opponent_wins'),
  z.literal('avg_opponent_points'),
  z.literal('avg_opponent_platoons_killed'),
  z.literal('avg_opponent_platoons_lost'),
]);

export type FowV4RankingFactor = z.infer<typeof fowV4RankingFactorSchema>;