import { Infer, v } from 'convex/values';

export const fowV4MatchOutcomeType = v.union(
  v.literal('objective_taken'),
  v.literal('attack_repelled'),
  v.literal('force_broken'),
  v.literal('time_out'),
);

export type FowV4MatchOutcomeType = Infer<typeof fowV4MatchOutcomeType>;
