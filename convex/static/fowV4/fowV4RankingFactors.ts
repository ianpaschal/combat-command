import { Infer, v } from 'convex/values';

export const fowV4RankingFactors = [
  'total_wins',
  'total_points',
  'total_units_destroyed',
  'total_units_lost',
  'avg_wins',
  'avg_points',
  'avg_units_destroyed',
  'avg_units_lost',
  'avg_opponent_wins',
  'avg_opponent_points',
  'avg_opponent_units_destroyed',
  'avg_opponent_units_lost',
] as const;

export const fowV4RankingFactor = v.union(...fowV4RankingFactors.map(v.literal));

export type FowV4RankingFactor = Infer<typeof fowV4RankingFactor>;

// TODO: Move to front-end for translations
export const fowV4RankingFactorDisplayNames: Record<FowV4RankingFactor, string> = {
  'total_wins' : 'Total Wins',
  'total_points': 'Total Victory Points',
  'total_units_destroyed': 'Total Units Destroyed',
  'total_units_lost': 'Total Units Lost',
  'avg_wins': 'Avg. Wins per Round',
  'avg_points': 'Avg. Victory Points per Round',
  'avg_units_destroyed': 'Avg. Units Destroyed per Round',
  'avg_units_lost': 'Avg. Units Lost per Round',
  'avg_opponent_wins': 'Opponents\u{2019} Avg. Wins per Round',
  'avg_opponent_points': 'Opponents\u{2019} Avg. Points per Round',
  'avg_opponent_units_destroyed': 'Opponents\u{2019} Avg. Units Destroyed per Round',
  'avg_opponent_units_lost': 'Opponents\u{2019} Avg. Units Lost per Round',
};

export const fowV4RankingFactorOptions = fowV4RankingFactors.map((key) => ({
  value: key,
  label: fowV4RankingFactorDisplayNames[key],
}));
