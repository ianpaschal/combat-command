import { Infer, v } from 'convex/values';

export const fowV4StatKeys = [
  'points',
  'units_destroyed',
  'units_lost',
  'wins',
] as const;

export const fowV4RankingFactorGroups = [
  'average_opponent',
  'average',
  'total_opponent',
  'total',
] as const;

export const fowV4RankingFactors = [
  'average_opponent_points',
  'average_opponent_units_destroyed',
  'average_opponent_units_lost',
  'average_opponent_wins',

  'average_points',
  'average_units_destroyed',
  'average_units_lost',
  'average_wins',

  'total_opponent_points',
  'total_opponent_units_destroyed',
  'total_opponent_units_lost',
  'total_opponent_wins',

  'total_points',
  'total_units_destroyed',
  'total_units_lost',
  'total_wins',
] as const;

/**
 * Determines which ranking factors should be interpreted as "higher is better" and which as "lower is better".
 */
export const fowV4RankingFactorDesirability: Record<FowV4RankingFactor, 'higher' | 'lower'> = {
  average_opponent_points: 'higher', // Signifies higher opponent strength
  average_opponent_units_destroyed: 'higher', // Signifies higher opponent strength
  average_opponent_units_lost: 'lower',
  average_opponent_wins: 'higher', // Signifies higher opponent strength
  average_points: 'higher',
  average_units_destroyed: 'higher',
  average_units_lost: 'lower',
  average_wins: 'higher',
  total_opponent_points: 'higher', // Signifies higher opponent strength
  total_opponent_units_destroyed: 'higher', // Signifies higher opponent strength
  total_opponent_units_lost: 'lower',
  total_opponent_wins: 'higher', // Signifies higher opponent strength
  total_points: 'higher',
  total_units_destroyed: 'higher',
  total_units_lost: 'lower',
  total_wins: 'higher',
} as const;

export const fowV4RankingFactor = v.union(...fowV4RankingFactors.map(v.literal));

export type FowV4RankingFactor = Infer<typeof fowV4RankingFactor>;

// TODO: Move to front-end for translations
export const fowV4RankingFactorDisplayNames: Record<FowV4RankingFactor, string> = {
  'average_opponent_points': 'Opponent\u{2019}s Avg. Points per Round',
  'average_opponent_units_destroyed': 'Opponent\u{2019}s Avg. Units Destroyed per Round',
  'average_opponent_units_lost': 'Opponent\u{2019}s Avg. Units Lost per Round',
  'average_opponent_wins': 'Opponent\u{2019}s Avg. Wins per Round',

  'average_points': 'Avg. Points per Round',
  'average_units_destroyed': 'Avg. Units Destroyed per Round',
  'average_units_lost': 'Avg. Units Lost per Round',
  'average_wins': 'Avg. Wins per Round',

  'total_opponent_points': 'Total Opponent Points',
  'total_opponent_units_destroyed': 'Total Opponent Units Destroyed',
  'total_opponent_units_lost': 'Total Opponent Units Lost',
  'total_opponent_wins': 'Total Opponent Wins',

  'total_points': 'Total Points',
  'total_units_destroyed': 'Total Units Destroyed',
  'total_units_lost': 'Total Units Lost',
  'total_wins' : 'Total Wins',
};

export const fowV4RankingFactorShortNames: Record<FowV4RankingFactor, string> = {
  'average_opponent_points': 'Op. Avg. Pts.',
  'average_opponent_units_destroyed': 'Op. Avg. UD',
  'average_opponent_units_lost': 'Opponent\u{2019}s Avg. Units Lost per Round',
  'average_opponent_wins': 'Opponent\u{2019}s Avg. Wins per Round',

  'average_points': 'Avg. Points per Round',
  'average_units_destroyed': 'Avg. Units Destroyed per Round',
  'average_units_lost': 'Avg. Units Lost per Round',
  'average_wins': 'Avg. Wins per Round',

  'total_opponent_points': 'Op. Pts.',
  'total_opponent_units_destroyed': 'Op. Units Dest.',
  'total_opponent_units_lost': 'Op. Units Lost',
  'total_opponent_wins': 'Op. Wins',

  'total_points': 'Pts.',
  'total_units_destroyed': 'Units Dest.',
  'total_units_lost': 'Units Lost',
  'total_wins' : 'Wins',
};

export const fowV4RankingFactorOptions = fowV4RankingFactors.map((key) => ({
  value: key,
  label: fowV4RankingFactorDisplayNames[key],
}));
