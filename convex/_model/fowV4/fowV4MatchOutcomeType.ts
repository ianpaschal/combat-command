import { Infer, v } from 'convex/values';

// Use these values to also create Zod schemas in the front-end
export const fowV4MatchOutcomeTypeValues = [
  'objective_taken',
  'attack_repelled',
  'force_broken',
  'time_out',
] as const;

export const fowV4MatchOutcomeType = v.union(...fowV4MatchOutcomeTypeValues.map(v.literal));

export type FowV4MatchOutcomeType = Infer<typeof fowV4MatchOutcomeType>;
