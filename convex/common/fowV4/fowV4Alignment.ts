import { Infer, v } from 'convex/values';

// Use these values to also create Zod schemas in the front-end
export const fowV4AlignmentValues = [
  'axis',
  'allies',
  'mixed',
] as const;

export const fowV4Alignment = v.union(...fowV4AlignmentValues.map(v.literal));

export type FowV4Alignment = Infer<typeof fowV4Alignment>;
