import { Infer, v } from 'convex/values';

export const fowV4RankingFactors = [
  'total_wins',
  'total_points',
  'total_units_destroyed',
  'total_units_lost',
  'average_wins',
  'average_points',
  'average_units_destroyed',
  'average_units_lost',
  'average_opponent_wins',
  'average_opponent_points',
  'average_opponent_units_destroyed',
  'average_opponent_units_lost',
] as const;

export const fowV4RankingFactor = v.union(...fowV4RankingFactors.map(v.literal));

export type FowV4RankingFactor = Infer<typeof fowV4RankingFactor>;

// TODO: Move to front-end for translations
export const fowV4RankingFactorDisplayNames: Record<FowV4RankingFactor, string> = {
  'total_wins' : 'Total Wins',
  'total_points': 'Total Battlefront Points',
  'total_units_destroyed': 'Total Units Destroyed',
  'total_units_lost': 'Total Units Lost',
  'average_wins': 'Avg. Wins per Round',
  'average_points': 'Avg. Points per Round',
  'average_units_destroyed': 'Avg. Units Destroyed per Round',
  'average_units_lost': 'Avg. Units Lost per Round',
  'average_opponent_wins': 'Opponent\u{2019}s Avg. Wins per Round',
  'average_opponent_points': 'Opponent\u{2019}s Avg. Points per Round',
  'average_opponent_units_destroyed': 'Opponent\u{2019}s Avg. Units Destroyed per Round',
  'average_opponent_units_lost': 'Opponent\u{2019}s Avg. Units Lost per Round',
};

export const fowV4RankingFactorOptions = fowV4RankingFactors.map((key) => ({
  value: key,
  label: fowV4RankingFactorDisplayNames[key],
}));
