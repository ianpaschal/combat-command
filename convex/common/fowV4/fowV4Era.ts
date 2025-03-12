import { Infer, v } from 'convex/values';

export const fowV4Era = v.union(
  v.literal('ew'),
  v.literal('mw'),
  v.literal('lw'),
  v.literal('lwl'),
  v.literal('pacific'),
);

export type FowV4Era = Infer<typeof fowV4Era>;
