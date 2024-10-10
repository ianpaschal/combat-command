import { z, ZodLiteral } from 'zod';

import { InputSelectItem } from '~/components/generic/InputSelect/InputSelect';

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

export const fowV4RankingFactorLabels: Record<FowV4RankingFactor, string> = {
  total_wins: 'Total Wins',
  total_points: 'Total Points',
  total_platoons_killed: 'Total Platoons Killed',
  total_platoons_lost: 'Total Platoons Lost',
  avg_opponent_wins: 'Avg. Opponent Wins',
  avg_opponent_points: 'Avg. Opponent Points',
  avg_opponent_platoons_killed: 'Avg. Opponent Platoons Killed',
  avg_opponent_platoons_lost: 'Avg. Opponent Platoons Lost',
};

export const fowV4RankingFactorOptions: InputSelectItem[] = fowV4RankingFactorSchema.options.filter(
  (option) => option instanceof ZodLiteral,
).map(
  ({ value }) => ({ value, label: fowV4RankingFactorLabels[value] }),
);