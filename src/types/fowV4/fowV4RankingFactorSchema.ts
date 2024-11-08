import { z, ZodLiteral } from 'zod';

export const fowV4RankingFactorSchema = z.union([
  z.literal('total_wins'),
  z.literal('total_points'),
  z.literal('total_units_destroyed'),
  z.literal('total_units_lost'),
  z.literal('avg_wins'),
  z.literal('avg_points'),
  z.literal('avg_units_destroyed'),
  z.literal('avg_units_lost'),
  z.literal('total_opponent_wins'),
  z.literal('total_opponent_points'),
  z.literal('total_opponent_units_destroyed'),
  z.literal('total_opponent_units_lost'),
  z.literal('avg_opponent_wins'),
  z.literal('avg_opponent_points'),
  z.literal('avg_opponent_units_destroyed'),
  z.literal('avg_opponent_units_lost'),
]);

export type FowV4RankingFactor = z.infer<typeof fowV4RankingFactorSchema>;

export const fowV4RankingFactorLabels: Record<FowV4RankingFactor, string> = {
  total_wins: 'Total Wins',
  total_points: 'Total Points',
  total_units_destroyed: 'Total Platoons Destroyed',
  total_units_lost: 'Total Platoons Lost',
  avg_wins: 'Avg. Wins',
  avg_points: 'Avg. Points',
  avg_units_destroyed: 'Avg. Platoons Destroyed',
  avg_units_lost: 'Avg. Platoons Lost',
  total_opponent_wins: 'Total Opponent Wins',
  total_opponent_points: 'Total Opponent Points',
  total_opponent_units_destroyed: 'Total Opponent Platoons Destroyed',
  total_opponent_units_lost: 'Total Opponent Platoons Lost',
  avg_opponent_wins: 'Avg. Opponent Wins',
  avg_opponent_points: 'Avg. Opponent Points',
  avg_opponent_units_destroyed: 'Avg. Opponent Platoons Destroyed',
  avg_opponent_units_lost: 'Avg. Opponent Platoons Lost',
};

export const fowV4RankingFactorOptions = fowV4RankingFactorSchema.options.filter(
  (option) => option instanceof ZodLiteral,
).map(
  ({ value }) => ({ value, label: fowV4RankingFactorLabels[value] }),
);

export type RankingFactorKey = string | number | symbol;