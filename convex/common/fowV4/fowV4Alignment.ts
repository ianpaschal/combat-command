import { Infer, v } from 'convex/values';

export const fowV4Alignment = v.union(
  v.literal('axis'),
  v.literal('allies'),
  v.literal('mixed'),
);

export type FowV4Alignment = Infer<typeof fowV4Alignment>;
